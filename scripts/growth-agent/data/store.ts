import * as fs from 'fs';
import * as path from 'path';
import { Lead } from '../lead-gen.js';

export interface ActivityLog {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

export interface GrowthData {
  lastRun: string | null;
  seoScore: number;
  leads: Lead[];
  activities: ActivityLog[];
  agentStatus: 'IDLE' | 'RUNNING' | 'ERROR';
}

const DATA_FILE = path.join(process.cwd(), 'scripts', 'growth-agent', 'data', 'growth-data.json');

const DEFAULT_DATA: GrowthData = {
  lastRun: null,
  seoScore: 0,
  leads: [],
  activities: [],
  agentStatus: 'IDLE'
};

export class DataStore {
  private data: GrowthData;

  constructor() {
    this.data = this.load();
  }

  private load(): GrowthData {
    if (!fs.existsSync(DATA_FILE)) {
      this.save(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      console.error("Failed to load growth data, resetting...", e);
      return DEFAULT_DATA;
    }
  }

  public save(data?: GrowthData) {
    if (data) this.data = data;
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  public get(): GrowthData {
    return this.data;
  }

  public update(partial: Partial<GrowthData>) {
    this.data = { ...this.data, ...partial };
    this.save();
  }

  public addLead(lead: Lead) {
    // Check for duplicates
    if (!this.data.leads.find(l => l.id === lead.id)) {
      this.data.leads.push(lead);
      this.save();
    }
  }

  public updateLead(leadId: string, updates: Partial<Lead>) {
    const index = this.data.leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      this.data.leads[index] = { ...this.data.leads[index], ...updates };
      this.save();
    }
  }

  public log(message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') {
    const log: ActivityLog = {
      timestamp: new Date().toISOString(),
      type,
      message
    };
    // Keep last 100 logs
    this.data.activities.unshift(log);
    if (this.data.activities.length > 100) {
      this.data.activities = this.data.activities.slice(0, 100);
    }
    this.save();
    console.log(`[${type}] ${message}`);
  }
}
