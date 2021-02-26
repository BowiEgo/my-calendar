import { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import useLongPress from '../../utils/useLongPress';
import TaskBlock from './TaskBlock';

const TaskBlockSolid = props => {
  const {
    id,
    top,
    actived,
    disabled,
    onActive,
    onDisactive,
    onPickUp,
    onPutDown,
    onClick,
    onResize,
  } = props;

  const blockRef = useRef();
  const resizeRef = useRef();

  const onPressStart = e => {
    onActive(id);
    if (e.target === resizeRef.current) {
      onResize && onResize(id);
    }
  };

  const onPressEnd = e => {
    onDisactive && onDisactive(id);
  };

  const onLongPressStart = e => {
    if (e.target !== resizeRef.current) {
      onPickUp && onPickUp(id);
    }
  };

  const onLongPressEnd = e => {};

  const handleClick = e => {
    onClick && onClick(id, blockRef.current);
  };

  const defaultOptions = {
    stopPropagation: true,
    isCapture: true,
    delay: 500,
  };

  const { longPressTriggered, bind: longPressEvent } = useLongPress(
    onPressStart,
    onPressEnd,
    onLongPressStart,
    onLongPressEnd,
    handleClick,
    defaultOptions,
  );

  const renderResizeArea = () => {
    return <ResizeArea key={'resize'} ref={resizeRef}></ResizeArea>;
  };

  const slots = [renderResizeArea()];

  return (
    <div {...longPressEvent}>
      <TaskBlock
        {...props}
        isSolid={true}
        disabled={disabled}
        slots={slots}
        ref={blockRef}
      >
        {actived ? 'actived' : ''}
      </TaskBlock>
    </div>
  );
};

const ResizeArea = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  cursor: ns-resize;
`;

export default TaskBlockSolid;
