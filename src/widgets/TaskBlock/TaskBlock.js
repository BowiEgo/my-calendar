import { useState, useEffect } from 'react';
import styled from 'styled-components';

const TaskBlock = props => {
  // Props
  const {
    task,
    top,
    height,
    shadow,
    resizing,
    moving,
    disabled = false,
    onPutDown,
  } = props;
  const { title, type, startTime, endTime } = task;

  // States
  const [isDragging, setIsDragging] = useState(false);
  const [cursor, setCursor] = useState('auto');

  const handleMouseDown = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleMouseUp = e => {
    console.log('handleMouseUp-resizing', resizing);
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (resizing) {
      props.finishResizing();
    }
    // onPutDown && onPutDown(task);
  };

  // const handleClick = e => {
  //   console.log('handleClick', e);
  // };

  const handleFinishMouseUp = e => {
    console.log('handleMouseUp-resizing', resizing);
    e.stopPropagation();
    e.preventDefault();
    handleMouseUp();
  };

  const handleFinish = e => {
    e.stopPropagation();
    e.preventDefault();
    console.log('finish', e);
    props.onFinish();
  };

  useEffect(() => {
    if (resizing) {
      setCursor('ns-resize');
    }
  }, [resizing]);

  return (
    <Container
      top={top}
      height={height}
      shadow={shadow}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      moving={moving}
      // onClick={handleClick}
      cursor={cursor}
      // onClick={e => onClick(e)}
      // onMouseMove={e => onMouseMove(e)}
    >
      {height > 50 && (
        <InnerBlock>
          <div>{startTime.format('HH:mm')}</div>
          <h5>{title}</h5>
          <div>{endTime.format('HH:mm')}</div>
          {shadow && (
            <button
              onClick={handleFinish}
              onMouseUp={handleFinishMouseUp}
              style={{
                width: '60px',
                height: '20px',
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#3f51b5',
              }}
            ></button>
          )}
        </InnerBlock>
      )}
    </Container>
  );
};

const Container = styled.div.attrs(props => ({
  style: {
    height: props.height + 'px',
    cursor: props.cursor,
    opacity: props.disabled ? '0.3' : 1,
    transform: `translate3d(0, ${props.top}px, 0)`,
    boxShadow:
      props.shadow || props.moving
        ? `0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
        : 'none',
  },
}))`
  position: absolute;
  top: 0;
  left: 4px;
  width: calc(100% - 8px);
  background-color: #d6ebfd;
  font-size: 12px;
  color: blue;
`;

const InnerBlock = styled.div`
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default TaskBlock;
