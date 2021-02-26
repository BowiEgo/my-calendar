import { useRef, useEffect, useState } from 'react';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      console.log('222', ref.current);
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
