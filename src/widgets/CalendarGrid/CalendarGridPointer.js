import { useState, useRef, useEffect, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import moment from 'moment';

const POINTER_WIDTH = 60;
const POINTER_HEIGHT = 24;

const CalendarGridPointer = ({ tableHeight, tableWidth, onInitialed }) => {
  const [nowTime, setNowTime] = useState(moment());
  const [top, setTop] = useState(0);

  const timer = useRef();
  const startTime = useRef();
  const initialed = useRef(false);
  const topChanged = useRef(false);

  startTime.current = nowTime.clone().startOf('day');

  const getTop = useCallback(() => {
    return (
      (tableHeight * nowTime.diff(startTime.current, 'second')) / (60 * 60 * 24)
    );
  }, [nowTime, tableHeight]);

  const itvCallback = useCallback(() => {
    setNowTime(moment());
    if (!initialed.current) {
      initialed.current = true;
    }
  }, [initialed]);

  useEffect(() => {
    timer.current = setInterval(() => itvCallback(), 1000);

    return () => {
      clearInterval(timer.current);
    };
  }, [itvCallback]);

  useEffect(() => {
    setTop(getTop(nowTime));
  }, [nowTime, getTop]);

  useEffect(() => {
    if (initialed.current & !topChanged.current & (top + tableHeight / 2 > 0)) {
      onInitialed(top);
      topChanged.current = true;
    }
  }, [top, initialed, tableHeight, onInitialed]);

  return (
    <Container top={top - POINTER_HEIGHT / 2} initialed={initialed.current}>
      <PointerLabel>{nowTime.format('HH:mm:ss')}</PointerLabel>
      <PointerLine width={tableWidth}></PointerLine>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: ${props => props.top + 'px'};
  display: ${props => (props.initialed ? 'block' : 'none')};
`;

const PointerLabel = styled.div`
  width: ${POINTER_WIDTH}px;
  height: ${POINTER_HEIGHT}px;
  border-radius: 6px;
  background-color: #f44336;
  color: white;
  font-size: 12px;
  line-height: ${POINTER_HEIGHT}px;
  text-align: center;
`;

const PointerLine = styled.div`
  position: absolute;
  top: ${POINTER_HEIGHT / 2}px;
  left: ${POINTER_WIDTH}px;
  width: ${props => props.width + 'px'};
  height: 1px;
  background-color: #ffd5d2;
`;

export default CalendarGridPointer;
