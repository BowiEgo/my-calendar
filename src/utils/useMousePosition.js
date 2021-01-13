import { useState, useEffect, useRef } from 'react';
import { _reqFrame } from './reqFrame';

const useMousePosition = fn => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [originY, setOriginY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseMove = event => {
    const pos = {
      x:
        event.nativeEvent.pageX -
        event.currentTarget.getBoundingClientRect().left,
      y:
        event.pageY -
        parseInt(event.currentTarget.getBoundingClientRect().top) +
        event.currentTarget.scrollTop,
    };

    setMousePosition(
      fn({
        x: pos.x,
        y: pos.y,
      }),
    );

    setOriginY(pos.y);
    setScrollTop(event.currentTarget.scrollTop);
  };

  const handleScroll = event => {
    setMousePosition(
      fn({
        x: mousePosition.x,
        y: originY + event.target.scrollTop - scrollTop,
      }),
    );
  };

  const bind = {
    onMouseMoveCapture: handleMouseMove,
    onScroll: handleScroll,
  };

  return {
    mousePosition,
    bind,
  };
};

export default useMousePosition;
