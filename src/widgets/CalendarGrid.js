import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import { TaskBlock, TaskBlockSolid } from './index';
import { _reqFrame } from '../utils/reqFrame';
import { cloneDeep } from 'lodash';

let bid = 0;

const CalendarGrid = props => {
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

  // Refs
  const tableRef = useRef();
  const scrollRef = useRef();
  const tableRect = useRef();
  const scrollTopOld = useRef(0);
  const activedCol = useRef(0);
  const activedBlockIndex = useRef(-1);
  const taskTemp = useRef({
    date: null,
    startTime: null,
    endTime: null,
    title: '无标题',
    type: 'work',
    shadow: true,
  });

  // States
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [taskElTop, setTaskElTop] = useState(0);
  const [taskElHeight, setTaskElHeight] = useState(0);
  const [taskBlockList, setTaskBlockList] = useState([]);

  const changeStartTime = useCallback(() => {
    let startTime = getRelatveTime(
      taskElTop,
      tableRef.current,
      week[activedCol.current],
    );
    taskTemp.current.startTime = startTime;
  }, [taskElTop, week]);

  const changeEndTime = useCallback(() => {
    let endTime = getRelatveTime(
      taskElTop + taskElHeight,
      tableRef.current,
      week[activedCol.current],
    );
    taskTemp.current.endTime = endTime;
  }, [taskElTop, taskElHeight, week]);

  // Mounted;
  useEffect(() => {
    let BCR = tableRef.current.getBoundingClientRect();
    tableRect.current = BCR;
  }, []);

  // Watch States
  useEffect(() => {
    changeStartTime();
    changeEndTime();
  }, [taskElTop, changeStartTime, changeEndTime]);

  useEffect(() => {
    // handle resizing block
    changeEndTime();
    setIsResizing(true);
  }, [taskElHeight, changeEndTime]);

  useEffect(() => {
    setTaskElTop(0);
    setTaskElHeight(0);
    setIsResizing(false);
    taskTemp.current.startTime = null;
    taskTemp.current.endTime = null;
    taskTemp.current.date = null;
  }, [taskBlockList]);

  const handleMouseDown = e => {
    let startPoint = getRelativePoint(
      e,
      tableRect.current,
      scrollRef.current.scrollTop,
    );

    activedCol.current = parseInt(startPoint.x / (tableRect.current.width / 7));
    taskTemp.current.date = taskTemp.current.date || week[activedCol.current];

    setTaskElTop(startPoint.y);
    setIsDrawing(true);
  };

  const handleMouseMove = e => {
    // console.log('22222', e.target);
    e.stopPropagation();
    e.preventDefault();
    // e.nativeEvent.stopImmediatePropagation();
    if (isDrawing) {
      let mouseTop = e.nativeEvent.layerY;
      let height = Math.abs(mouseTop - taskElTop);

      // if (height > 20) {

      setTaskElHeight(height);
      // }
    }

    if (isMoving) {
      setTaskElTop(taskElTop + e.movementY);
    }
  };

  const handleScroll = e => {
    if (isMoving) {
      let scrollTopOffset = scrollRef.current.scrollTop - scrollTopOld.current;
      setTaskElTop(taskElTop + scrollTopOffset);
      scrollTopOld.current = scrollRef.current.scrollTop;
    }
  };

  const handleMouseUp = e => {
    console.log('handleMouseUp');
    if (isDrawing) {
      setTaskBlockList([
        ...taskBlockList,
        cloneDeep({
          id: ++bid,
          top: taskElTop,
          height: taskElHeight,
          disabled: false,
          task: taskTemp.current,
        }),
      ]);

      setIsDrawing(false);
    }

    isMoving && setIsMoving(false);
  };

  const handleBlockPickUp = useCallback(
    task => {
      console.log('handleBlockPickUp', task);
      activedBlockIndex.current = taskBlockList.findIndex(
        block => block.task === task,
      );

      let activedBlock = taskBlockList[activedBlockIndex.current];

      taskTemp.current = cloneDeep(activedBlock.task);
      activedCol.current = taskTemp.current.date.day();
      setTaskElTop(activedBlock.top);
      setTaskElHeight(activedBlock.height);

      setIsMoving(true);
    },
    [taskBlockList],
  );

  const handleBlockPutDown = task => {
    console.log('handleBlockPutDown', task, taskTemp.current);

    let newBlockList = [...taskBlockList];

    newBlockList[activedBlockIndex.current] = {
      top: taskElTop,
      height: taskElHeight,
      disabled: false,
      task: cloneDeep(taskTemp.current),
    };

    setTaskBlockList(newBlockList);
    setIsMoving(false);
  };

  // TimeTable
  const tableEl = week.map((date, index) => (
    <GridTableCol key={index}>
      {[
        hours.map((h, idx) => (
          <GridTableCell key={idx} className="grid-table-cell"></GridTableCell>
        )),
        taskBlockList.map(
          (block, idx) =>
            block.task.date.isSame(date) && (
              <TaskBlockSolid
                task={block.task}
                key={idx}
                top={block.top}
                height={block.height}
                disabled={block.disabled}
                onPickUp={task => handleBlockPickUp(task)}
              ></TaskBlockSolid>
            ),
        ),
        (isDrawing || isMoving) & (index === activedCol.current) ? (
          <TaskBlock
            task={taskTemp.current}
            key={-1}
            top={taskElTop}
            height={taskElHeight}
            onPutDown={task => handleBlockPutDown(task)}
            shadow
          />
        ) : null,
      ]}
    </GridTableCol>
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
      <GridContentScroll
        isResizing={isResizing}
        ref={scrollRef}
        onScroll={e => handleScroll(e)}
      >
        <GridContent>
          <GridLabel>{labelEl}</GridLabel>
          <GridTable
            ref={tableRef}
            onMouseDown={e => handleMouseDown(e)}
            onMouseMove={e => _reqFrame(() => handleMouseMove(e))}
            onMouseUp={e => handleMouseUp(e)}
          >
            {tableEl}
          </GridTable>
        </GridContent>
      </GridContentScroll>
    </GridContainer>
  );
};

function getRelativePoint(event, containerBCR, scrollTop) {
  return {
    x: event.clientX - containerBCR.x,
    y: event.clientY - containerBCR.y + scrollTop,
  };
}

function getRelatveTime(y, container, date) {
  if (!date) return;
  const minutes = parseInt(
    24 * 60 * (y / container.getBoundingClientRect().height),
  );
  return date.clone().add(minutes, 'minutes');
}

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

const GridContentScroll = styled.div`
  overflow-y: scroll;
  width: calc(100% + 4px);
  display: flex;
  flex: 1 1 auto;
  height: 0px;
  cursor: ${props => (props.isResizing ? 'row-resize' : 'auto')};
  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
  align-items: flex-start; // 使子元素撑满搞度
`;

const GridContent = styled.div`
  display: flex;
  flex: 1;
  min-height: min-content;
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
