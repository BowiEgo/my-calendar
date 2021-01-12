import { useState } from 'react';
import useLongPress from '../../utils/useLongPress';
import TaskBlock from './TaskBlock';

const TaskBlockSolid = props => {
  const onLongPressStart = e => {
    console.log('longpress is start', e);
    props.onPickUp(props.task);
    // e.stopPropagation();
    // setDisabled(true);
    // console.log('longpress is triggered', e);
  };

  const onLongPressEnd = e => {
    // e.stopPropagation();
    // setDisabled(false);
    // props.onPutDown && props.onPutDown(task);
    console.log('longpress is ended', e);
  };

  const onMouseMove = e => {
    e.stopPropagation();
    // console.log('onMouseMove');
    // e.nativeEvent.stopImmediatePropagation();
  };

  const onClick = e => {
    // e.stopPropagation();
    console.log('click is triggered', e, props);
  };

  const defaultOptions = {
    // shouldPreventDefault: true,
    stopPropagation: true,
    delay: 500,
  };

  const { longPressTriggered, bind: longPressEvent } = useLongPress(
    onLongPressStart,
    onLongPressEnd,
    defaultOptions,
  );

  return (
    <div {...longPressEvent}>
      <TaskBlock {...props}></TaskBlock>
    </div>
  );
};

export default TaskBlockSolid;
