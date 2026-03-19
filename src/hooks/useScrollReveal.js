import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -60px 0px',
      }
    );

    const children = element.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    if (element.classList.contains('reveal')) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}
