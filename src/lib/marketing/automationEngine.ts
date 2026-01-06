/**
 * Marketing Automation Engine
 * Core engine for processing automation workflows
 */

import { prisma } from '@/lib/prisma';
import type { 
  AutomationTrigger, 
  AutomationWorkflow,
  AutomationStep,
  WorkflowExecution,
  Prisma
} from '@prisma/client';
import { logAgentAction } from '@/lib/services/agentLogger';
import {
  sendWelcomeEmail,
  sendAbandonedCartEmail,
  sendReEngagementEmail
} from '@/lib/email/emailAutomation';

// Trigger event data types
export interface TriggerEvent {
  trigger: AutomationTrigger;
  contactId?: string;
  customerId?: string;
  email?: string;
  data?: Record<string, unknown>;
}

// Step execution context
export interface StepContext {
  execution: WorkflowExecution;
  step: AutomationStep;
  data: Record<string, unknown>;
}

// Workflow with steps included
type WorkflowWithSteps = AutomationWorkflow & {
  steps: AutomationStep[];
};

/**
 * Marketing Automation Engine Class
 */
export class AutomationEngine {
  
  /**
   * Trigger workflows based on an event
   */
  async handleTrigger(event: TriggerEvent): Promise<string[]> {
    const executionIds: string[] = [];
    
    try {
      // Find active workflows matching this trigger
      const workflows = await prisma.automationWorkflow.findMany({
        where: {
          trigger: event.trigger,
          status: 'ACTIVE'
        },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (workflows.length === 0) {
        console.log(`[Automation] No active workflows for trigger: ${event.trigger}`);
        return [];
      }
      
      // Create executions for each matching workflow
      for (const workflow of workflows) {
        // Check if workflow conditions are met
        if (!this.checkTriggerConditions(workflow, event)) {
          continue;
        }
        
        // Prevent duplicate executions for same contact/workflow
        const existingExecution = await prisma.workflowExecution.findFirst({
          where: {
            workflowId: workflow.id,
            contactId: event.contactId || null,
            customerId: event.customerId || null,
            status: { in: ['PENDING', 'RUNNING', 'WAITING'] }
          }
        });
        
        if (existingExecution) {
          console.log(`[Automation] Execution already exists for workflow ${workflow.id}`);
          continue;
        }
        
        // Create new execution
        const execution = await prisma.workflowExecution.create({
          data: {
            workflowId: workflow.id,
            contactId: event.contactId,
            customerId: event.customerId,
            status: 'PENDING',
            data: {
              email: event.email,
              triggerData: event.data || null
            } as Prisma.InputJsonValue
          }
        });
        
        executionIds.push(execution.id);
        
        // Log the trigger
        await logAgentAction({
          agent: 'marketing',
          action: 'run_started',
          status: 'RUNNING',
          message: `Workflow "${workflow.name}" triggered by ${event.trigger}`,
          metadata: { workflowId: workflow.id, executionId: execution.id }
        });
        
        // Start processing the workflow
        this.processExecution(execution.id, workflow);
      }
      
      return executionIds;
    } catch (error) {
      console.error('[Automation] Error handling trigger:', error);
      await logAgentAction({
        agent: 'marketing',
        action: 'run_error',
        status: 'ERROR',
        message: `Failed to handle trigger: ${event.trigger}`,
        metadata: { error: String(error) }
      });
      return [];
    }
  }
  
  /**
   * Check if trigger conditions are met
   */
  private checkTriggerConditions(
    workflow: WorkflowWithSteps, 
    event: TriggerEvent
  ): boolean {
    const config = workflow.config as Record<string, unknown> || {};
    
    // Check time-based conditions
    if (config.activeHoursStart && config.activeHoursEnd) {
      const now = new Date();
      const hour = now.getHours();
      const start = config.activeHoursStart as number;
      const end = config.activeHoursEnd as number;
      
      if (hour < start || hour > end) {
        return false;
      }
    }
    
    // Check day-of-week conditions
    if (config.activeDays && Array.isArray(config.activeDays)) {
      const today = new Date().getDay();
      if (!config.activeDays.includes(today)) {
        return false;
      }
    }
    
    // Check minimum cart value for abandoned cart
    if (event.trigger === 'ABANDONED_CART' && config.minCartValue) {
      const cartValue = (event.data?.cartValue as number) || 0;
      if (cartValue < (config.minCartValue as number)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Process a workflow execution
   */
  async processExecution(
    executionId: string, 
    workflow?: WorkflowWithSteps
  ): Promise<void> {
    try {
      // Get the execution
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId }
      });
      
      if (!execution) {
        console.error(`[Automation] Execution not found: ${executionId}`);
        return;
      }
      
      // Get the workflow if not provided
      if (!workflow) {
        const wf = await prisma.automationWorkflow.findUnique({
          where: { id: execution.workflowId },
          include: {
            steps: { orderBy: { order: 'asc' } }
          }
        });
        
        if (!wf) {
          await this.failExecution(executionId, 'Workflow not found');
          return;
        }
        workflow = wf;
      }
      
      // Update status to running
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: { status: 'RUNNING' }
      });
      
      const steps = workflow.steps;
      const executionData = execution.data as Record<string, unknown> || {};
      
      // Process each step starting from current step
      for (let i = execution.currentStep; i < steps.length; i++) {
        const step = steps[i];
        
        // Handle delays
        if (step.delayMins > 0 && i === execution.currentStep) {
          // Calculate when to resume
          const resumeAt = new Date(Date.now() + step.delayMins * 60 * 1000);
          
          await prisma.workflowExecution.update({
            where: { id: executionId },
            data: { 
              status: 'WAITING',
              data: {
                ...executionData,
                resumeAt: resumeAt.toISOString()
              } as Prisma.InputJsonValue
            }
          });
          
          console.log(`[Automation] Execution ${executionId} waiting until ${resumeAt}`);
          return; // Will be resumed by scheduler
        }
        
        // Execute the step
        const result = await this.executeStep({
          execution,
          step,
          data: executionData
        });
        
        if (!result.success) {
          await this.failExecution(executionId, result.error || 'Step execution failed');
          return;
        }
        
        // Update current step
        await prisma.workflowExecution.update({
          where: { id: executionId },
          data: { 
            currentStep: i + 1,
            data: { ...executionData, ...result.data } as Prisma.InputJsonValue
          }
        });
      }
      
      // Workflow completed
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });
      
      await logAgentAction({
        agent: 'marketing',
        action: 'run_completed',
        status: 'SUCCESS',
        message: `Workflow "${workflow.name}" completed`,
        metadata: { workflowId: workflow.id, executionId }
      });
      
    } catch (error) {
      console.error('[Automation] Error processing execution:', error);
      await this.failExecution(executionId, String(error));
    }
  }
  
  /**
   * Execute a single step
   */
  private async executeStep(context: StepContext): Promise<{
    success: boolean;
    error?: string;
    data?: Record<string, unknown>;
  }> {
    const { step, data } = context;
    const config = step.config as Record<string, unknown> || {};
    
    try {
      switch (step.type) {
        case 'SEND_EMAIL':
          return await this.executeSendEmail(config, data);
          
        case 'WAIT':
          // Wait steps are handled by delay logic
          return { success: true };
          
        case 'CONDITION':
          return await this.executeCondition(config, data);
          
        case 'UPDATE_CONTACT':
          return await this.executeUpdateContact(config, data);
          
        case 'ADD_TAG':
          return await this.executeAddTag(config, data);
          
        case 'WEBHOOK':
          return await this.executeWebhook(config, data);
          
        case 'SOCIAL_POST':
          return await this.executeSocialPost(config, data);
          
        case 'INTERNAL_NOTE':
          console.log(`[Automation] Note: ${config.message}`);
          return { success: true };
          
        default:
          return { success: true };
      }
    } catch (error) {
      console.error(`[Automation] Step ${step.type} failed:`, error);
      return { success: false, error: String(error) };
    }
  }
  
  /**
   * Execute SEND_EMAIL step
   */
  private async executeSendEmail(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string; data?: Record<string, unknown> }> {
    const email = data.email as string;
    const emailType = config.emailType as string;
    const customerName = data.customerName as string || undefined;
    
    if (!email) {
      return { success: false, error: 'No email address' };
    }
    
    let result;
    
    switch (emailType) {
      case 'welcome':
        result = await sendWelcomeEmail(email, customerName, config.discountCode as string);
        break;
        
      case 'abandoned_cart':
        const cartData = data.cart as Record<string, unknown> || {};
        result = await sendAbandonedCartEmail({
          email,
          customerName,
          items: cartData.items as Array<{ productId: number; name: string; price: number; quantity: number }> || [],
          createdAt: new Date(),
          reminderCount: 0
        }, config.discountCode as string, config.discountPercent as number);
        break;
        
      case 'reengagement':
        result = await sendReEngagementEmail(
          email, 
          customerName, 
          config.discountCode as string,
          config.discountPercent as number
        );
        break;
        
      default:
        // Generic email - use template from config
        return { success: false, error: `Unknown email type: ${emailType}` };
    }
    
    return { 
      success: result.success, 
      error: result.error,
      data: { lastEmailId: result.id }
    };
  }
  
  /**
   * Execute CONDITION step
   */
  private async executeCondition(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string; data?: Record<string, unknown> }> {
    const field = config.field as string;
    const operator = config.operator as string;
    const value = config.value;
    const fieldValue = data[field];
    
    let conditionMet = false;
    
    switch (operator) {
      case 'equals':
        conditionMet = fieldValue === value;
        break;
      case 'not_equals':
        conditionMet = fieldValue !== value;
        break;
      case 'greater_than':
        conditionMet = (fieldValue as number) > (value as number);
        break;
      case 'less_than':
        conditionMet = (fieldValue as number) < (value as number);
        break;
      case 'contains':
        conditionMet = String(fieldValue).includes(String(value));
        break;
      case 'exists':
        conditionMet = fieldValue !== undefined && fieldValue !== null;
        break;
    }
    
    return { 
      success: conditionMet, 
      data: { conditionResult: conditionMet }
    };
  }
  
  /**
   * Execute UPDATE_CONTACT step
   */
  private async executeUpdateContact(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    const email = data.email as string;
    const updates = config.updates as Record<string, unknown>;
    
    if (!email || !updates) {
      return { success: false, error: 'Missing email or updates' };
    }
    
    await prisma.emailContact.update({
      where: { email },
      data: updates as Record<string, string | number | boolean | null>
    });
    
    return { success: true };
  }
  
  /**
   * Execute ADD_TAG step
   */
  private async executeAddTag(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    const email = data.email as string;
    const tag = config.tag as string;
    
    if (!email || !tag) {
      return { success: false, error: 'Missing email or tag' };
    }
    
    const contact = await prisma.emailContact.findUnique({
      where: { email }
    });
    
    if (contact) {
      const currentTags = (contact.tags || []) as string[];
      if (!currentTags.includes(tag)) {
        await prisma.emailContact.update({
          where: { email },
          data: { tags: [...currentTags, tag] }
        });
      }
    }
    
    return { success: true };
  }
  
  /**
   * Execute WEBHOOK step
   */
  private async executeWebhook(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    const url = config.url as string;
    const method = (config.method as string) || 'POST';
    
    if (!url) {
      return { success: false, error: 'Missing webhook URL' };
    }
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      return { success: false, error: `Webhook failed: ${response.status}` };
    }
    
    return { success: true };
  }
  
  /**
   * Execute SOCIAL_POST step
   */
  private async executeSocialPost(
    config: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    const platform = config.platform as string;
    const content = config.content as string;
    
    // Schedule the post instead of posting immediately
    await prisma.scheduledPost.create({
      data: {
        platform: platform as 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER' | 'PINTEREST' | 'LINKEDIN',
        content: this.interpolateContent(content, data),
        mediaUrls: config.mediaUrls as string[] || null,
        hashtags: config.hashtags as string[] || null,
        scheduledAt: new Date(),
        status: 'SCHEDULED'
      }
    });
    
    return { success: true };
  }
  
  /**
   * Interpolate variables in content
   */
  private interpolateContent(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(data[key] || match);
    });
  }
  
  /**
   * Mark execution as failed
   */
  private async failExecution(executionId: string, error: string): Promise<void> {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'FAILED',
        error,
        completedAt: new Date()
      }
    });
    
    await logAgentAction({
      agent: 'marketing',
      action: 'run_error',
      status: 'ERROR',
      message: `Execution failed: ${error}`,
      metadata: { executionId }
    });
  }
  
  /**
   * Resume waiting executions
   */
  async resumeWaitingExecutions(): Promise<number> {
    const now = new Date();
    let resumed = 0;
    
    const waitingExecutions = await prisma.workflowExecution.findMany({
      where: { status: 'WAITING' }
    });
    
    for (const execution of waitingExecutions) {
      const data = execution.data as Record<string, unknown> || {};
      const resumeAt = data.resumeAt ? new Date(data.resumeAt as string) : null;
      
      if (resumeAt && resumeAt <= now) {
        // Update to advance past the current step
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: { currentStep: execution.currentStep + 1 }
        });
        
        // Resume processing
        this.processExecution(execution.id);
        resumed++;
      }
    }
    
    return resumed;
  }
}

// Export singleton instance
export const automationEngine = new AutomationEngine();
