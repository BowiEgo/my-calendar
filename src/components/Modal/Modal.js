import { useState, useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '../../utils/useClickOutside';

const Portal = function ({ children, container }, ref) {
  return createPortal(children, container || document.body);
};

const Modal = ({ isOpen, container, left, onClickOutside, children }) => {
  const childRef = useRef();

  useClickOutside(childRef, () => {
    onClickOutside();
  });

  const child = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0, display: 'block' }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, display: 'none' }}
        >
          <Content ref={childRef}>{children}</Content>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Portal container={container}>
      {isOpen && <Container left={left}>{child}</Container>}
    </Portal>
  );
};

const Container = styled.div`
  position: fixed;
  top: 40%;
  left: ${props => props.left + 'px' || 0};
  z-index: 9999;
`;

const Content = styled.div`
  background-color: white;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

export default Modal;
