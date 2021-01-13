import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useLongPress = (
  onPressStart,
  onPressEnd,
  onLongPressStart,
  onLongPressEnd,
  onClick,
  { stopPropagation, isCapture = false, delay = 300 } = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timer = useRef();

  const start = useCallback(
    event => {
      stopPropagation && event.stopPropagation();
      onPressStart(event);
      timer.current = setTimeout(() => {
        setLongPressTriggered(true);
        onLongPressStart(event);
      }, delay);
    },
    [onPressStart, onLongPressStart, stopPropagation, delay],
  );

  const end = useCallback(
    (event, shouldTriggerEnd = true) => {
      stopPropagation && event.stopPropagation();
      timer.current !== undefined && clearTimeout(timer.current);

      if (event.type === 'mouseup') {
        onPressEnd(event);
      }

      if (longPressTriggered & shouldTriggerEnd) {
        setLongPressTriggered(false);
        onLongPressEnd(event);
      } else if (event.type === 'mouseup') {
        onClick(event);
      }
    },
    [onPressEnd, onLongPressEnd, stopPropagation, longPressTriggered, onClick],
  );

  useEffect(
    () => () => {
      timer.current !== undefined && clearTimeout(timer.current);
    },
    [],
  );

  const bind = !isCapture
    ? {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e),
        onMouseUp: e => end(e),
        onMouseLeave: e => end(e, false),
        onTouchEnd: e => end(e),
      }
    : {
        onMouseDownCapture: e => start(e),
        onTouchStartCapture: e => start(e),
        onMouseUpCapture: e => end(e),
        onMouseLeave: e => end(e, false),
        onTouchEndCapture: e => end(e),
      };

  return {
    longPressTriggered,
    bind,
  };
};

export default useLongPress;
