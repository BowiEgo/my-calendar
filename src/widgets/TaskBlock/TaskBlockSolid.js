import { useState, useRef, useEffect, useMemo } from 'react';
import useLongPress from '../../utils/useLongPress';
import TaskBlock from './TaskBlock';

const TaskBlockSolid = props => {
  const {
    id,
    top,
    actived,
    onActive,
    onDisactive,
    onPickUp,
    onPutDown,
  } = props;

  const moving = useRef(false);

  useEffect(() => {
    moving.current = true;
  }, [top]);

  useEffect(() => {
    if (!actived) {
      moving.current = false;
    }
  }, [actived]);

  const onPressStart = e => {
    onActive(id);
  };

  const onPressEnd = e => {
    onDisactive(id);
    moving.current = false;
  };

  const onLongPressStart = e => {
    !moving.current && onPickUp(id);
  };

  const onLongPressEnd = e => {
    moving.current = false;
  };

  const onClick = e => {
    console.log('click is triggered', e, props);
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
    onClick,
    defaultOptions,
  );

  return (
    <div {...longPressEvent}>
      <TaskBlock {...props} moving={moving.current}></TaskBlock>
    </div>
  );
};

export default TaskBlockSolid;