'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  delay?: number; // allow custom delay
}

export default function ScrollReveal({ children, threshold = 0.1, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  // We reuse the existing animate-fade-up class logic but control it via visibility state.
  // Or we apply a style transformation.
  // Given we have 'animate-fade-up' in globals.css which runs immediately,
  // we can just toggle a class that *contains* the animation.
  
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
