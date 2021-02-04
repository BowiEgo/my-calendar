import {
  motion,
  AnimatePresence,
  animate,
  useAnimation,
  useMotionValue,
} from 'framer-motion';

const WeekBgMotion = () => {
  return (
    <motion.div
      animate={control}
      transition={{ duration: 0.3 }}
      style={{ height: '100%', flex: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default WeekBgMotion;
