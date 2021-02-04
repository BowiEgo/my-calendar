import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { motion, useAnimation } from 'framer-motion';

const GridMotion = forwardRef(({ resolveFn, children }, ref) => {
  console.log('ref', ref);
  const [weekSwitchStatus, setWeekSwitchStatus] = useState('static');

  const control = useAnimation();

  useEffect(() => {
    switchPromise.then(() => resolveFn && resolveFn());
  }, [weekSwitchStatus]);

  useImperativeHandle(ref, () => ({
    prev: () => {
      setWeekSwitchStatus('prev');
    },
    next: () => {
      setWeekSwitchStatus('next');
    },
  }));

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
      // setIsVisible(true);

      setTimeout(() => {
        setWeekSwitchStatus('static');
        resolve();
      }, 300);
    } else {
      // setIsVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      animate={control}
      transition={{ duration: 0.3 }}
      style={{ height: '100%', flex: 1 }}
    >
      {children}
    </motion.div>
  );
});

export default GridMotion;
