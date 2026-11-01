'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { setupSiteMotion } from '@/lib/site-motion';

export function InteractiveSurface({children}:{children:ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cleanup = setupSiteMotion(element);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { cleanup(); cleanup = setupSiteMotion(element); };
    preference.addEventListener('change', update);
    return () => { preference.removeEventListener('change', update); cleanup(); };
  }, []);
  return <MotionConfig reducedMotion="user"><div className="interactive-surface" ref={root}>{children}</div></MotionConfig>;
}
