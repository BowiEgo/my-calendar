import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

const DURATION = 0.2;

const useWeekBarMotion = ({ pos, initialPos, fixY, resolveFn } = {}) => {
  const control = useAnimation();

  useEffect(() => {
    console.log('watch-pos', pos, initialPos);
    if (pos >= 0) {
      animePromise();
    }
  }, [pos]);

  const animePromise = useCallback(() => {
    if (initialPos > 0) {
      control.set({
        y: initialPos * 36 + fixY,
      });
      control.start({
        y: pos * 36 + fixY,
        // type: 'spring',
        // stiffness: 2000,
      });
    }
  }, [pos]);

  return {
    motion,
    motionProps: {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${pos * 36 + fixY}px)`,
        zIndex: -1,
      },
      animate: control,
      transition: { duration: DURATION },
    },
  };
};

export default useWeekBarMotion;
