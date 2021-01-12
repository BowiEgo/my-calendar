import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useLongPress = (
  onLongPressStart,
  onLongPressEnd,
  { stopPropagation, delay = 300 } = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  // const isLongPressActived = useRef(false);
  const isPressed = useRef(false);
  const timer = useRef();

  const start = useCallback(
    event => {
      stopPropagation && event.stopPropagation();
      isPressed.current = true;
      timer.current = setTimeout(() => {
        setLongPressTriggered(true);
        // isLongPressActived.current = true;
        onLongPressStart(event);
      }, delay);
    },
    [onLongPressStart, stopPropagation, delay, longPressTriggered],
  );

  const end = useCallback(
    (event, shouldTriggerEnd = true) => {
      console.log(event._reactName);
      stopPropagation && event.stopPropagation();
      timer.current !== undefined && clearTimeout(timer.current);

      if (longPressTriggered & shouldTriggerEnd) {
        setLongPressTriggered(false);
        isPressed.current = false;
        onLongPressEnd(event);
      }
    },
    [onLongPressEnd, stopPropagation],
  );

  useEffect(
    () => () => {
      timer.current !== undefined && clearTimeout(timer.current);
    },
    [],
  );

  const bind = {
    onMouseDown: e => start(e),
    onTouchStart: e => start(e),
    onMouseUp: e => end(e),
    onMouseLeave: e => end(e, false),
    onTouchEnd: e => end(e),
  };

  return {
    longPressTriggered,
    bind,
  };
};

export default useLongPress;
