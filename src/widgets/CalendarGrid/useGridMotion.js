import { useState, useEffect } from 'react';
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion';

const useGridMotion = ({ resolveFn } = {}) => {
  const [weekSwitchStatus, setWeekSwitchStatus] = useState('static');

  const control = useAnimation();

  const prev = () => {
    setWeekSwitchStatus('prev');
  };

  const next = () => {
    setWeekSwitchStatus('next');
  };

  const switchPromise = new Promise((resolve, reject) => {
    if (weekSwitchStatus !== 'static') {
      if (weekSwitchStatus === 'prev') {
        control.set({ x: -80, opacity: 0 });
        control.start({ x: 0, opacity: 1 });
      } else {
        control.set({ x: 80, opacity: 0 });
        control.start({ x: 0, opacity: 1 });
      }
      setTimeout(() => {
        setWeekSwitchStatus('static');
        resolve();
      }, 300);
    }
  });

  useEffect(() => {
    switchPromise.then(() => resolveFn && resolveFn());
  }, [weekSwitchStatus, switchPromise, resolveFn]);

  return {
    motion,
    motionProps: {
      animate: control,
      transition: { duration: 0.3 },
    },
    motionHandlers: {
      prev,
      next,
    },
  };
};

export default useGridMotion;
