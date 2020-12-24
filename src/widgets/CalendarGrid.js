import styled from "styled-components";
import moment from "moment";
import { Calendar as CalendarIcon } from "react-feather";

const primary = "rgb(85, 68, 228)";

const CalendarGrid = (props) => {
  const { selectedDate, week } = props;
  const weekdaysShort = moment.weekdaysShort();

  const wl = week.map((date, idx) => {
    return (
      <WeekCell
        isActive={date.isSame(selectedDate)}
        isToday={date.isSame(moment().startOf("day"))}
        key={idx}
      >
        <h5>{weekdaysShort[date.weekday()]}</h5>
        <span>{date.date()}</span>
      </WeekCell>
    );
  });

  let ht = 0;
  const hours = Array(24)
    .fill(0)
    .map(() => ht++);

  const labelEl = (
    <div>
      {hours.map((h, index) => (
        <GridLabelCell key={index}>
          <span>{h < 10 ? `0${h}:00` : `${h}:00`}</span>
        </GridLabelCell>
      ))}
    </div>
  );

  const tableEl = week.map((col, index) => (
    <GridTableCol key={index}>
      {hours.map((h, idx) => (
        <GridTableCell key={idx} className="grid-table-cell"></GridTableCell>
      ))}
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
      <GridContent>
        <GridContentScroll>
          <GridLabel>{labelEl}</GridLabel>
          <GridTable>{tableEl}</GridTable>
        </GridContentScroll>
      </GridContent>
    </GridContainer>
  );
};

const borderColor = "#e8e3f7";

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
  border-top: 1px solid ${borderColor};
  border-bottom: 1px solid ${borderColor};
  background-color: #f8f7fd;
`;

const WeekLabelContainer = styled.div`
  position: relative;
  width: 60px;
  padding: 4px;
  display: flex;
  &::after {
    content: "";
    display: block;
    width: 1px;
    height: 100%;
    position: absolute;
    right: -1px;
    top: 0;
    background-color: ${borderColor};
  }
`;

const WeekLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 3px;
  background-color: #e8e3f7;
`;

const WeekCell = styled.div`
  flex: 1;
  height: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${borderColor};
  line-height: 26px;
  span {
    font-size: 14px;
    color: ${(props) => {
      if (props.isActive) {
        return primary;
      } else if (props.isToday) {
        return "rgb(243, 109, 154)";
      }
      return "#9e9e9e";
    }};
  }
  h5 {
    margin: 0;
    color: ${(props) => {
      if (props.isActive) {
        return primary;
      } else if (props.isToday) {
        return "rgb(243, 109, 154)";
      }
      return "#333";
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
  height: 7vw;
  &:first-child span {
    display: none;
  }
  span {
    display: block;
    transform: translateY(-6px);
  }
`;

const GridTable = styled.div`
  display: flex;
  flex: 1;
`;

const GridTableCol = styled.div`
  flex: 1;
  &:first-child .grid-table-cell {
    border-left: 1px solid ${borderColor};
  }
`;

const GridTableCell = styled.div`
  height: 7vw;
  border-bottom: 1px solid ${borderColor};
  border-right: 1px solid ${borderColor};
  box-sizing: border-box;
`;

export default CalendarGrid;
