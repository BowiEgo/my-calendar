import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import {
  motion,
  AnimatePresence,
  animate,
  useAnimation,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { Button } from './components';

function Playground() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Sidebar isOpen={isOpen}></Sidebar>
      <Sidebar isOpen={isOpen} isReduce={false}></Sidebar>
      <Button
        width={30}
        height={32}
        backgroundColor={'#000'}
        onClick={() => setIsOpen(!isOpen)}
      ></Button>
    </div>
  );
}

function Sidebar({ isOpen, isReduce }) {
  const shouldReduceMotion = useReducedMotion();
  let closedX = '-100%';
  // if (isReduce) {
  // closedX = shouldReduceMotion ? 0 : '-100%';
  // }

  return (
    <motion.div
      animate={{
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : closedX,
        transition: { duration: 3 },
      }}
    >
      <SidebarContainer></SidebarContainer>
    </motion.div>
  );
}

const SidebarContainer = styled.div`
  width: 100px;
  height: 100px;
  background-color: #000;
`;

export default Playground;
