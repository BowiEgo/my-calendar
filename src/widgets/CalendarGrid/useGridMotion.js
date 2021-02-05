import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const useGridMotion = ({ resolveFn } = {}) => {
  const [weekSwitchStatus, setWeekSwitchStatus] = useState('static');

  const control = useAnimation();

  useEffect(() => {
    switchPromise.then(() => resolveFn && resolveFn());
  }, [weekSwitchStatus]);

  const prev = () => {
    setWeekSwitchStatus('prev');
  };

  const next = () => {
    setWeekSwitchStatus('next');
  };

  const switchPromise = new Promise((resolve, reject) => {
    if (weekSwitchStatus !== 'static') {
      if (weekSwitchStatus === 'prev') {
        control.set({
          opacity: 0,
          translateX: -80,
        });
        control.start({
          opacity: 1,
          translateX: 0,
        });
      } else {
        control.set({ opacity: 0, translateX: 80 });
        control.start({
          opacity: 1,
          translateX: 0,
        });
      }
      setTimeout(() => {
        setWeekSwitchStatus('static');
        resolve();
      }, 300);
    }
  });

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
