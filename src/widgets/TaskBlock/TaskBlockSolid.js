import { useState, useEffect } from 'react';
import useLongPress from '../../utils/useLongPress';
import TaskBlock from './TaskBlock';

const TaskBlockSolid = props => {
  const { task, top, actived, moving } = props;

  const onPressStart = e => {
    props.onActive(task);
  };

  const onPressEnd = e => {
    props.onDisactive(task);
  };

  const onLongPressStart = e => {
    console.log('longpress is start', e, moving);
    // !moving && props.onPickUp(task);
    // e.stopPropagation();
    // setDisabled(true);
  };

  const onLongPressEnd = e => {
    // e.stopPropagation();
    // setDisabled(false);
    // props.onPutDown && props.onPutDown(task);
    console.log('longpress is ended', e);
  };

  const onMouseMove = e => {
    e.stopPropagation();
    console.log('onMouseMove', e);
    // e.nativeEvent.stopImmediatePropagation();
  };

  const onClick = e => {
    // e.stopPropagation();
    console.log('click is triggered', e, props);
  };

  const defaultOptions = {
    // shouldPreventDefault: true,
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
      <TaskBlock {...props}></TaskBlock>
    </div>
  );
};

export default TaskBlockSolid;
