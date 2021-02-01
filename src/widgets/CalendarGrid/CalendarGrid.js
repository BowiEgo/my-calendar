import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  motion,
  AnimatePresence,
  animate,
  useAnimation,
  useMotionValue,
} from 'framer-motion';
import styled from 'styled-components';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import { Modal } from '../../components';
import {
  CalendarGridTable as GridTable,
  CalendarGridPointer as GridPointer,
  TaskEditor,
} from '../index';
import useMousePosition from '../../utils/useMousePosition';

let bid = 0;

const CalendarGrid = ({ selectedDate, week, scrollTop, rootContainer }) => {
  // Props
  const weekdaysShort = moment.weekdaysShort();

  const [labelWidth, setLabelWidth] = useState(0);

  const containerRef = useRef();
  const scrollRef = useRef();
  const labelElRef = useRef();
  const motionTable = useRef();
  const tableHeight = useRef(0);
  const tableWidth = useRef(0);

  // store
  const weekSwitchStatus = useSelector(state => state.weekSwitchStatus);
  const isTaskEditorOpen = useSelector(state => state.isTaskEditorOpen);
  const taskEditorPosition = useSelector(state => state.taskEditorPosition);

  const dispatch = useDispatch();

  // animate
  const control = useAnimation();

  const handleTableMounted = tableBCR => {
    tableHeight.current = tableBCR.height;
    tableWidth.current = tableBCR.width;
  };

  const handlePointerInitialed = pointerTop => {
    scrollRef.current.scrollTop =
      pointerTop - scrollRef.current.getBoundingClientRect().height / 2;
  };

  const closeModal = () => {
    dispatch({
      type: 'CHANGE_IS_TASK_EDITOR_OPEN',
      payload: {
        isTaskEditorOpen: false,
      },
    });
  };

  useEffect(() => {
    setLabelWidth(labelElRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    if (weekSwitchStatus !== 'static') {
      if (weekSwitchStatus === 'prev') {
        control.set({
          opacity: 0,
          translateX: -80,
        });
        control.start({
          opacity: 1,
          translateX: 0,
        });
      } else {
        control.set({ opacity: 0, translateX: 80 });
        control.start({
          opacity: 1,
          translateX: 0,
        });
      }
      // setIsVisible(true);

      setTimeout(() => {
        dispatch({
          type: 'CHANGE_WEEK_SWITCH_STATUS',
          payload: {
            weekSwitchStatus: 'static',
          },
        });
      }, 300);
    } else {
      // setIsVisible(false);
    }
  }, [weekSwitchStatus, control, dispatch]);

  const renderWeekList = () => {
    return week.map((date, idx) => {
      return (
        <motion.div
          key={idx}
          animate={control}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', flex: 1 }}
        >
          <WeekCell
            isActive={date.isSame(selectedDate)}
            isToday={date.isSame(moment().startOf('day'))}
          >
            <h5>{weekdaysShort[date.weekday()]}</h5>
            <span>{date.date()}</span>
          </WeekCell>
        </motion.div>
      );
    });
  };

  // TimeLabel
  const renderTimeLabel = () => {
    let ht = 0;
    const hours = Array(24)
      .fill(0)
      .map(() => ht++);

    return (
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
  };

  const { mousePosition, bind: mouseEvent } = useMousePosition(pos => {
    let posX = pos.x - labelWidth;

    return {
      x: posX < 0 ? 0 : posX,
      y: pos.y,
    };
  });

  return (
    <GridContainer ref={containerRef}>
      <GridWeekContainer>
        <GridWeek>
          <WeekLabelContainer>
            <WeekLabel>
              <CalendarIcon color="grey" size="20"></CalendarIcon>
            </WeekLabel>
          </WeekLabelContainer>
          {renderWeekList()}
        </GridWeek>
      </GridWeekContainer>
      <GridContentScroll {...mouseEvent} ref={scrollRef}>
        <GridContent>
          <GridLabel ref={labelElRef}>{renderTimeLabel()}</GridLabel>
          <GridPointer
            tableHeight={tableHeight.current}
            tableWidth={tableWidth.current}
            onInitialed={handlePointerInitialed}
          ></GridPointer>
          <motion.div
            animate={control}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', flex: 1 }}
            ref={motionTable}
          >
            <GridTable
              week={week}
              mousePosition={mousePosition}
              onMounted={handleTableMounted}
            ></GridTable>
          </motion.div>
        </GridContent>
      </GridContentScroll>
      <Modal
        left={taskEditorPosition}
        isOpen={isTaskEditorOpen}
        container={rootContainer}
        onClickOutside={closeModal}
      >
        <TaskEditor></TaskEditor>
      </Modal>
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
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
  position: relative;
  overflow-y: scroll;
  width: calc(100% + 4px);
  display: flex;
  flex: 1 1 auto;
  height: 0px;
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
  border-right: 1px solid ${props => props.theme.borderColor};
  box-sizing: content-box;
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

export default CalendarGrid;
