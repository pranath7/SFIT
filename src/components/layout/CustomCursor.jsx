import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Don't activate on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };


    const addHover = () => cursor.classList.add('hovering');
    const removeHover = () => cursor.classList.remove('hovering');

    document.addEventListener('mousemove', moveCursor);

    // Watch for interactive elements
    const observer = new MutationObserver(() => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .cursor-hover');
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .cursor-hover');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;
