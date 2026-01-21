'use client';

import { Check } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: number;
  steps: { title: string; description?: string }[];
}

export default function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  const widthClassMap: Record<number, string> = {
    0: 'w-0',
    10: 'w-[10%]',
    20: 'w-[20%]',
    30: 'w-[30%]',
    40: 'w-[40%]',
    50: 'w-[50%]',
    60: 'w-[60%]',
    70: 'w-[70%]',
    80: 'w-[80%]',
    90: 'w-[90%]',
    100: 'w-full'
  };

  const progressPercent = steps.length > 1
    ? ((currentStep - 1) / (steps.length - 1)) * 100
    : 100;
  const progressBucket = Math.min(100, Math.max(0, Math.round(progressPercent / 10) * 10));
  const progressWidthClass = widthClassMap[progressBucket] || 'w-0';

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10" />
        
        {/* Progress line */}
        <div 
          className={`absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500 ${progressWidthClass}`}
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
