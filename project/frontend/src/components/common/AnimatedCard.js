import React, { useEffect, useRef } from 'react';
import '../../animations/transitions.css';

const AnimatedCard = ({ children, className = '', onClick, animate = true, delay = 0 }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-slide-in');
          }, delay);
        }
      },
      {
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [animate, delay]);

  return (
    <div
      ref={cardRef}
      className={`bg-gray-900 rounded-lg p-6 card-hover ${className}`}
      onClick={onClick}
      style={{ opacity: animate ? 0 : 1 }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;