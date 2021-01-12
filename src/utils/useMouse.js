import { useState } from 'react';

const useMouse = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = event => {
    setMousePosition({
      x: event.nativeEvent.layerX,
      y: event.nativeEvent.layerY,
    });
  };

  const bind = {
    onMouseMove: handleMouseMove,
  };

  return {
    mousePosition,
    bind,
  };
};

export default useMouse;
