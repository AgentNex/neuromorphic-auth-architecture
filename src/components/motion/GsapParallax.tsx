"use client";

import React, { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function GsapParallax({ children, speed = 1, className = "" }: GsapParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const yValue = 100 * speed;

    const ctx = gsap.context(() => {
      gsap.to(target, {
        y: -yValue,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={targetRef} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
