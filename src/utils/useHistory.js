import { useRef } from 'react';

export default function useHistory(initialValue, { size = 10 } = {}) {
  const present = useRef();
  const past = useRef([]);
  const future = useRef([]);

  const redo = () => {
    past.current.push(draft.present);
    present.current = future.current.shift();
  };

  const undo = () => {
    future.current.unshift(draft.present);
    present.current = past.current.pop();
  };

  const update = val => {
    if (val !== present.current) {
      if (past.current.length >= size) {
        past.current.shift();
      }
      past.current.push(present.current);
      future.current = [];
      present.current = val;
    }
  };

  const getPast = step => {
    return past.current.slice(past.current.length - step);
  };

  const getFuture = step => {
    return future.current.slice(step);
  };

  return {
    present: present.current,
    update,
    getPast,
    getFuture,
    redo,
    undo,
  };
}
