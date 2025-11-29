// hooks/useAnimatedNumber.ts

"use client";

import { useState, useEffect, useRef } from 'react';

// An easing function for a smooth start and finish
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useAnimatedNumber = (endValue: number, duration: number = 500) => {
  const [displayValue, setDisplayValue] = useState(endValue);
  const startValueRef = useRef(endValue);
  const animationFrameRef = useRef<number | null>(null); // This is the correct ref name

  useEffect(() => {
    const startValue = startValueRef.current;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        startValueRef.current = endValue;
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // --- THIS IS THE FIX ---
    // Use the correctly named ref here
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      // --- AND THE FIX IS HERE ---
      // Use the correctly named ref for cleanup as well
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [endValue, duration]);

  return displayValue;
};