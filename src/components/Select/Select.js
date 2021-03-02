import { useState, useRef, useEffect } from 'react';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '../../utils/useClickOutside';
import SelectContext from './SelectContext';

const Select = ({ defaultValue, width, children }) => {
  // state
  const [
    { value, options, selectedOption, isOpen, onChange },
    updateState,
  ] = useImmer({
    value: null,
    options: children.map(child => child.props),
    selectedOption:
      defaultValue !== undefined
        ? children
            .map(child => child.props)
            .find(option => option.value === defaultValue)
        : null,
    isOpen: false,
  });

  // reft
  const containerRef = useRef();

  // method
  const handleClick = () => {
    updateState(draft => {
      draft.isOpen = true;
    });
  };

  const setSelectedValue = value => {
    updateState(draft => {
      draft.selectedOption = options.find(option => option.value === value);
      draft.value = value;
    });
    onChange && onChange(value);
  };

  useClickOutside(containerRef, () => {
    updateState(draft => {
      draft.isOpen = false;
    });
  });

  useEffect(() => {
    updateState(draft => {
      draft.isOpen = false;
    });
  }, [value]);

  return (
    <Container ref={containerRef} width={width}>
      <Input onClick={handleClick}>
        {selectedOption ? selectedOption.children : 'Please Select...'}
      </Input>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SelectContext.Provider value={{ setSelectedValue }}>
              <List>{children}</List>
            </SelectContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: ${props => props.width + 'px'};
  height: 24px;
  line-height: 24px;
  &:hover {
    background-color: #ececec;
  }
`;

const Input = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  &:hover {
    background-color: #ececec;
  }
`;

const List = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  width: 100%;
  max-height: 200px;
  background-color: #fff;
  overflow: scroll;
  box-shadow: 0 3px 6px 3px rgba(0, 0, 0, 0.1);
`;

export default Select;
