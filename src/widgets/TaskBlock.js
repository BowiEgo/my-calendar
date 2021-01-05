import { useState, useRef } from 'react';
import styled from 'styled-components';
import { _reqFrame } from '../utils/reqFrame';

const TaskBlock = props => {
  // Props
  const { task, top, height, shadow } = props;
  const { title, type, startTime, endTime } = task;

  const [isDragging, setIsDragging] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function handleMouseDown(e) {
    e.stopPropagation();
    // setIsDragging(true);
    props.onMouseDown(e, task);
    // mouseOrigin.current = {
    //   x: e.nativeEvent.layerX,
    //   y: e.nativeEvent.layerY,
    // };
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    console.log('move-1');
    props.onMouseMove(e, task);
    setDisabled(true);
  }

  function handleMouseUp(e) {
    setIsDragging(false);
    setDisabled(false);
  }

  return (
    <Container
      top={top}
      height={height}
      shadow={shadow}
      disabled={disabled}
      onMouseDown={e => handleMouseDown(e)}
      // onMouseMove={e => _reqFrame(() => handleMouseMove(e))}
      // onMouseUp={e => handleMouseUp(e)}
    >
      {height > 50 && (
        <InnerBlock>
          <div>{startTime.format('HH:mm')}</div>
          <h5>{title}</h5>
          <div>{endTime.format('HH:mm')}</div>
        </InnerBlock>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 4px;
  width: calc(100% - 8px);
  height: ${props => props.height + 'px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #d6ebfd;
  font-size: 12px;
  color: blue;
  cursor: grab;
  opacity: ${props => (props.disabled ? '0.3' : 1)};
  transform: ${props => `translate3d(0, ${props.top}px, 0)`};
  box-shadow: ${props =>
    props.shadow
      ? `0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
      : 'none'};
`;

const InnerBlock = styled.div`
  padding: 10px;
`;

export default TaskBlock;
