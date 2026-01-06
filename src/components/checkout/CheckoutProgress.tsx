'use client';

import { Check } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: number;
  steps: { title: string; description?: string }[];
}

export default function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10" />
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={step.title} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    transition-all duration-300 border-2
                    ${isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isActive 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                        : 'bg-white/5 border-white/20 text-white/40'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-white/40'}`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-white/40 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile step text */}
      <p className="text-center text-emerald-400 text-sm mt-6 sm:hidden">
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
      </p>
    </div>
  );
}
