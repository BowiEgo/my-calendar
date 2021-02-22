import { useRef, useEffect } from 'react';
import { useImmer } from 'use-immer';
import moment from 'moment';

export default function useHistory(initialValue, { size = 10 } = {}) {
  // const [{ present }, updateState] = useImmer({
  //   present: initialValue,
  // });

  const present = useRef();
  const past = useRef([]);
  const future = useRef([]);

  const redo = () => {
    // updateState(draft => {
    //   past.current.push(draft.present);
    //   draft.present = future.current.pop();
    // });
    past.current.push(draft.present);
    present.current = future.current.shift();
  };

  const undo = () => {
    // updateState(draft => {
    //   future.current.push(draft.present);
    //   draft.present = past.current.pop();
    // });
    future.current.unshift(draft.present);
    present.current = past.current.pop();
  };

  const update = val => {
    console.warn('update', moment(val).format('MM-DD'));
    if (val !== present.current) {
      if (past.current.length >= size) {
        past.current.shift();
      }
      past.current.push(present.current);
      future.current = [];
      present.current = val;
      // updateState(draft => {
      //   draft.present = val;
      // });
    }
  };

  const getPast = step => {
    return past.current.slice(past.current.length - step);
  };

  const getFuture = step => {
    return future.current.slice(step);
  };

  useEffect(() => {
    console.log(
      'watch-present-888888888888888',
      moment(present.current).format('MM-DD'),
    );
  }, [present]);

  return {
    present: present.current,
    update,
    getPast,
    getFuture,
    redo,
    undo,
  };
}
