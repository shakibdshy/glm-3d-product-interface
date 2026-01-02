'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  value: number[];
  onValueChange: (value: [number]) => void;
  max: number;
  min: number;
  step: number;
}

export function Slider({ className, value, onValueChange, max, min, step, ...props }: SliderProps) {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={cn('relative h-2 w-full', className)} {...props}>
      <div className="absolute inset-0 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([parseFloat(e.target.value)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-amber-400 pointer-events-none transition-all duration-150"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}
