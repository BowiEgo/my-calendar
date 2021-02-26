import { useState, useMemo, forwardRef } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const TaskBlock = forwardRef(
  (
    {
      id = -1,
      unix,
      title = '无标题',
      type = 'work',
      top,
      height,
      outerHeight,
      shadow,
      moving,
      resizing,
      disabled = false,
      onPutDown,
      finishMoving,
      finishResizing,
      onFinish,
      onMouseUp,
      isSolid,
      children,
      slots,
    },
    ref,
  ) => {
    // console.log('block-update');
    // states
    const [isDragging, setIsDragging] = useState(false);

    // memo
    const date = useMemo(() => moment(unix), [unix]);

    const startTime = useMemo(() => getRelatveTime(top, outerHeight, date), [
      top,
      outerHeight,
      date,
    ]);

    const endTime = useMemo(
      () => getRelatveTime(top + height, outerHeight, date),
      [top, height, outerHeight, date],
    );

    const cursor = useMemo(() => {
      if (resizing) return 'ns-resize';
      if (moving) return 'move';
      if (isSolid) return 'pointer';
    }, [resizing, moving]);

    const handleMouseDown = e => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const handleMouseUp = e => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      onMouseUp();

      if (moving) {
        // finishMoving && finishMoving();
      }
      if (resizing) {
        // finishResizing && finishResizing();
      }
    };

    const handleFinishMouseUp = e => {
      e.stopPropagation();
      e.preventDefault();
      // handleMouseUp();
    };

    const handleFinish = e => {
      e.stopPropagation();
      e.preventDefault();
      onFinish();
    };

    return (
      <Container
        ref={ref}
        top={top}
        height={height}
        shadow={shadow}
        disabled={disabled}
        cursor={cursor}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // onClick={handleClick}
        // onClick={e => onClick(e)}
        // onMouseMove={e => onMouseMove(e)}
      >
        {height > 50 && (
          <InnerArea>
            <div>{startTime.format('HH:mm')}</div>
            {height > 80 && <Title>{title}</Title>}
            <div>{endTime.format('HH:mm')}</div>
            {children}
          </InnerArea>
        )}
        {slots}
      </Container>
    );
  },
);

function getRelatveTime(y, outerHeight, date) {
  if (!date) {
    return;
  }
  const minutes = parseInt(24 * 60 * (y / outerHeight));
  return date.clone().add(minutes, 'minutes');
}

const Container = styled.div.attrs(props => ({
  style: {
    height: props.height + 'px',
    cursor: props.cursor,
    opacity: props.disabled ? '0.3' : 1,
    transform: `translate3d(0, ${props.top}px, 0)`,
    boxShadow: props.shadow
      ? `0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
      : 'none',
  },
}))`
  position: absolute;
  top: 0;
  left: 4px;
  width: calc(100% - 8px);
  background-color: #e9f2fb;
  border-radius: 4px;
  font-size: 12px;
  color: #446ee4;
`;

const InnerArea = styled.div`
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  flex: 1;
  padding-top: 10px;
  font-weight: 600;
  font-size: 14px;
`;

export default TaskBlock;
