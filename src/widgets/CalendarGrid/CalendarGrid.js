import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'react-feather';
import { CalendarGridTable as GridTable } from '../index';
import useMousePosition from '../../utils/useMousePosition';

let bid = 0;

const CalendarGrid = props => {
  // Props
  const { selectedDate, week } = props;
  const weekdaysShort = moment.weekdaysShort();

  const [labelWidth, setLabelWidth] = useState(0);

  const labelElRef = useRef();

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

  const { mousePosition, bind: mouseEvent } = useMousePosition(pos => {
    let posX = pos.x - labelWidth;

    return {
      x: posX < 0 ? 0 : posX,
      y: pos.y,
    };
  });

  useEffect(() => {
    setLabelWidth(labelElRef.current.getBoundingClientRect().width);
  }, []);

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
      <GridContentScroll {...mouseEvent}>
        {/* <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'blue',
            position: 'absolute',
            left: mousePosition.x - 10 + 'px',
            top: mousePosition.y - 10 + 'px',
          }}
        ></div> */}
        <GridContent>
          <GridLabel ref={labelElRef}>{labelEl}</GridLabel>
          <GridTable week={week} mousePosition={mousePosition}></GridTable>
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
  position: relative;
  overflow-y: scroll;
  width: calc(100% + 4px);
  display: flex;
  flex: 1 1 auto;
  height: 0px;
  cursor: ${props => (props.isResizing ? 'ns-resize' : 'auto')};
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

export default CalendarGrid;
