'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-4 my-8">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div key={label} className="text-center">
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl px-4 py-3 min-w-[80px]">
              <span className="text-3xl md:text-4xl font-bold text-white">--</span>
            </div>
            <span className="text-xs text-emerald-300/70 mt-2 block">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-4 my-8">
      {timeUnits.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl px-3 md:px-5 py-3 min-w-[65px] md:min-w-[80px]">
            <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">
              {value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs text-emerald-300/70 mt-2 block font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
