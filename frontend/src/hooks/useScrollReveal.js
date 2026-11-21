import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — attaches an IntersectionObserver to a container ref
 * and toggles the `.visible` class on any child elements that have
 * `.reveal`, `.reveal-left`, or `.reveal-right` class names.
 *
 * @param {object}  options
 * @param {number}  options.threshold   - Visibility threshold (0–1). Default 0.12.
 * @param {string}  options.rootMargin  - Root margin. Default '0px 0px -40px 0px'.
 * @param {boolean} options.stagger     - Whether to apply staggered transition delays.
 * @param {number}  options.staggerMs   - Milliseconds between each stagger step. Default 100.
 */
export function useScrollReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    elements.forEach((el, i) => {
      if (options.stagger) {
        el.style.transitionDelay = `${i * (options.staggerMs ?? 100)}ms`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

export default useScrollReveal;
