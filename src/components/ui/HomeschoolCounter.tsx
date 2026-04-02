"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Dynamic counter estimating the number of US homeschool students.
 *
 * Base data:
 * - 3,408,000 students in the 2024-2025 school year (NHERI / JHU)
 * - 4.9% annual growth rate (JHU Institute for Education Policy)
 *
 * The counter interpolates from the base figure using the growth rate,
 * then ticks up in real time to give a "live estimate" feel.
 */

// Base: 3,408,000 as of August 2024 (start of 2024-2025 school year)
const BASE_COUNT = 3_408_000;
const BASE_DATE = new Date("2024-08-01T00:00:00Z");
const ANNUAL_GROWTH_RATE = 0.049; // 4.9% per year

function getEstimatedCount(): number {
  const now = new Date();
  const msElapsed = now.getTime() - BASE_DATE.getTime();
  const yearsElapsed = msElapsed / (365.25 * 24 * 60 * 60 * 1000);
  return Math.round(BASE_COUNT * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed));
}

// How many students are added per second (for the ticking effect)
function getStudentsPerSecond(): number {
  const currentEstimate = getEstimatedCount();
  const annualGrowth = currentEstimate * ANNUAL_GROWTH_RATE;
  return annualGrowth / (365.25 * 24 * 60 * 60);
}

export function HomeschoolCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer to trigger count-up animation when visible
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Animate count-up when visible, then tick in real time
  useEffect(() => {
    if (!isVisible) return;

    const targetCount = getEstimatedCount();
    const studentsPerSecond = getStudentsPerSecond();
    const animationDuration = 2000; // 2 seconds for count-up
    const startTime = performance.now();
    const startFrom = targetCount * 0.97; // Start from 97% for a subtle count-up

    let animationFrame: number;
    let tickInterval: ReturnType<typeof setInterval>;

    // Phase 1: Animated count-up
    const animateCountUp = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(startFrom + (targetCount - startFrom) * eased);
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCountUp);
      } else {
        // Phase 2: Real-time ticking
        let liveCount = targetCount;
        tickInterval = setInterval(() => {
          liveCount += studentsPerSecond * 3; // tick every 3 seconds
          setCount(Math.round(liveCount));
        }, 3000);
      }
    };

    animationFrame = requestAnimationFrame(animateCountUp);

    return () => {
      cancelAnimationFrame(animationFrame);
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [isVisible]);

  const formatted = count !== null
    ? count.toLocaleString("en-US")
    : getEstimatedCount().toLocaleString("en-US");

  return (
    <div ref={ref}>
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tabular-nums">
        {formatted}
      </div>
      <div className="mt-2 text-base sm:text-lg text-muted">
        kids are being homeschooled in the US right now
      </div>
    </div>
  );
}
