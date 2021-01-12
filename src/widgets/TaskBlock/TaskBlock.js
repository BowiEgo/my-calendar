import { useState } from 'react';
import styled from 'styled-components';

const TaskBlock = props => {
  // Props
  const { task, top, height, shadow, disabled = false, onPutDown } = props;
  const { title, type, startTime, endTime } = task;

  // States
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseUp = () => {
    console.log('handleMouseUp');
    onPutDown && onPutDown(task);
  };

  return (
    <Container
      top={top}
      height={height}
      shadow={shadow}
      disabled={disabled}
      onMouseUp={handleMouseUp}
      // onClick={e => onClick(e)}
      // onMouseMove={e => onMouseMove(e)}
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
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default TaskBlock;
