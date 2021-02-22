import { useState, useRef, useEffect, useMemo } from 'react';
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
  } = props;

  const blockRef = useRef();

  const onPressStart = e => {
    onActive(id);
  };

  const onPressEnd = e => {
    onDisactive(id);
  };

  const onLongPressStart = e => {
    onPickUp(id);
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

  return (
    <div {...longPressEvent}>
      <TaskBlock {...props} isSolid={true} disabled={disabled} ref={blockRef}>
        {actived ? 'actived' : ''}
      </TaskBlock>
    </div>
  );
};

export default TaskBlockSolid;
