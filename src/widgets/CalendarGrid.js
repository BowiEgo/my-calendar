import { useState, forwardRef, useRef } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import { TaskBlock } from './index';

const CalendarGrid = props => {
  // Refs
  const childRef = useRef();

  // States
  const [tasks, setTasks] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // const [activedCol, setActivedCol] = useState(0);
  const [taskElHeight, setTaskElHeight] = useState(0);
  const [taskElTop, setTaskElTop] = useState(0);

  // Props
  const { selectedDate, week } = props;
  const weekdaysShort = moment.weekdaysShort();

  // Weeklist
  const wl = week.map((date, idx) => {
    return (
      <WeekCell
        isActive={date.isSame(selectedDate)}
        isToday={date.isSame(moment().startOf('day'))}
        key={idx}
      >
        <h5>{weekdaysShort[date.weekday()]}</h5>
        <span>{date.date()}</span>
      </WeekCell>
    );
  });

  // TimeLabel
  let ht = 0;
  const hours = Array(24)
    .fill(0)
    .map(() => ht++);

  const labelEl = (
    <div>
      {hours.map((h, index) => (
        <GridLabelCell key={index}>
          <span>{h < 10 ? `0${h}:00` : `${h}:00`}</span>
          <Tick width={16} top={'25%'}></Tick>
          <Tick width={32} top={'50%'}></Tick>
          <Tick width={16} top={'75%'}></Tick>
        </GridLabelCell>
      ))}
    </div>
  );

  let tableElTop = 0;
  const handleMouseDown = e => {
    console.log('handleMouseDown', e);
    const tableDOM = childRef.current;
    const tableRect = tableDOM.getBoundingClientRect();
    tableElTop = tableRect.top;

    setIsDrawing(true);
    setTaskElTop(e.clientY - tableElTop);
    setTaskElHeight(0);
  };

  const handleMouseMove = e => {
    if (!isDrawing) return;
    const tableDOM = childRef.current;
    const tableRect = tableDOM.getBoundingClientRect();
    tableElTop = tableRect.top;

    let mouseTop = e.clientY - tableElTop;
    setTaskElHeight(Math.abs(mouseTop - taskElTop));
  };

  const handleMouseUp = e => {
    setIsDrawing(false);
    setTaskElTop(0);
    setTasks([
      ...tasks,
      {
        top: taskElTop,
        height: taskElHeight,
        startTime: 0,
        endTime: 0,
        title: 'hello world',
        type: 'work',
      },
    ]);
  };

  // TimeTable
  const tableEl = week.map((col, index) => (
    <GridTableCol key={index}>
      {[
        hours.map((h, idx) => (
          <GridTableCell key={idx} className="grid-table-cell"></GridTableCell>
        )),
        tasks.map((t, idx) => (
          <TaskBlock top={t.top} height={t.height} key={idx}></TaskBlock>
        )),
        isDrawing ? (
          <TaskBlock top={taskElTop} height={taskElHeight} key={0} float />
        ) : null,
      ]}
    </GridTableCol>
  ));

  const GridTableRef = forwardRef((props, ref) => (
    <GridTable
      ref={ref}
      onMouseDown={e => handleMouseDown(e)}
      onMouseMove={e => handleMouseMove(e)}
      onMouseUp={e => handleMouseUp(e)}
    >
      {tableEl}
    </GridTable>
  ));

  return (
    <GridContainer>
      <GridWeekContainer>
        <GridWeek>
          <WeekLabelContainer>
            <WeekLabel>
              <CalendarIcon color="grey" size="20"></CalendarIcon>
            </WeekLabel>
          </WeekLabelContainer>
          {wl}
        </GridWeek>
      </GridWeekContainer>
      <GridContent>
        <GridContentScroll>
          <GridLabel>{labelEl}</GridLabel>
          <GridTableRef ref={childRef}></GridTableRef>
        </GridContentScroll>
      </GridContent>
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const GridWeekContainer = styled.div`
  display: flex;
  height: 6.4vw;
`;

const GridWeek = styled.div`
  display: flex;
  flex: 1;
  border-top: 1px solid ${props => props.theme.borderColor};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.primaryColorTertiary};
`;

const WeekLabelContainer = styled.div`
  position: relative;
  width: 60px;
  padding: 4px;
  display: flex;
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    position: absolute;
    right: -1px;
    top: 0;
    background-color: ${props => props.theme.borderColor};
  }
`;

const WeekLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 3px;
  background-color: ${props => props.theme.primaryColorSecondary};
`;

const WeekCell = styled.div`
  flex: 1;
  height: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.borderColor};
  line-height: 26px;
  h5 {
    margin: 0;
    font-weight: 600;
    color: ${props => {
      if (props.isActive) {
        return props.theme.primaryColor;
      } else if (props.isToday) {
        return props.theme.hightlightColor;
      }
      return props.theme.textColor;
    }};
  }
  span {
    font-size: 14px;
    color: ${props => {
      if (props.isActive) {
        return props.theme.primaryColor;
      } else if (props.isToday) {
        return props.theme.hightlightColor;
      }
      return props.theme.textColorSecondary;
    }};
  }
`;

const GridContent = styled.div`
  overflow-y: scroll;
  width: calc(100% + 4px);
  display: flex;
  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
`;

const GridContentScroll = styled.div`
  display: flex;
  flex: 1;
`;

const GridLabel = styled.div`
  width: 60px;
  font-size: 14px;
  color: #9e9e9e;
`;

const GridLabelCell = styled.div`
  position: relative;
  height: 7vw;
  display: flex;
  flex-direction: column;
  &:first-child span {
    display: none;
  }
  span {
    display: block;
    transform: translateY(-6px);
  }
`;

const Tick = styled.div`
  position: absolute;
  left: 0;
  top: ${props => props.top};
  width: ${props => props.width + 'px'};
  height: 1px;
  background-color: ${props => props.theme.tickColor};
`;

const GridTable = styled.div`
  display: flex;
  flex: 1;
`;

const GridTableCol = styled.div`
  position: relative;
  flex: 1;
  &:first-child .grid-table-cell {
    border-left: 1px solid ${props => props.theme.borderColor};
  }
`;

const GridTableCell = styled.div`
  height: 7vw;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  border-right: 1px solid ${props => props.theme.borderColor};
  box-sizing: border-box;
`;

export default CalendarGrid;
