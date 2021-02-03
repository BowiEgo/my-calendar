import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useImmer } from 'use-immer';
import styled, { ThemeContext } from 'styled-components';
import moment, { unix } from 'moment';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Button, ButtonGroup } from '../../components';
import { CalendarCell } from '../index';

const nowUnix = new Date().getTime();
const calendarTmp = getCalendar(nowUnix);
const startOfMonthTmp = +moment(nowUnix).startOf('month').format('x');
const currentWeekIndexTmp = getRow(nowUnix, startOfMonthTmp);

const initialState = {
  startOfMonth: startOfMonthTmp,
  startOfWeek: +moment(nowUnix).startOf('week').format('x'),
  calendar: calendarTmp,
  currentWeekIndex: currentWeekIndexTmp,
  selectedDate: null,
};

const Calendar = ({ change, changeWeek }, ref) => {
  console.warn('calendar-update');

  // context
  const themeContext = useContext(ThemeContext);

  // state
  const [
    { selectedDate, startOfMonth, startOfWeek, calendar, currentWeekIndex },
    updateState,
  ] = useImmer(initialState);

  // ref
  const todayUnix = useRef(+moment().startOf('day').format('x'));

  // method
  const handleClickCell = unix => {
    console.warn('handleClickCell-0', unix, selectedDate);
    if (unix === selectedDate) return;

    const d = moment(unix);
    const row = getRow(unix, startOfMonth);

    updateState(draft => {
      draft.selectedDate = calendar[row][d.weekday()];
    });
    change(selectedDate);

    const weekStart = d.clone().startOf('week');

    if (!weekStart.isSame(startOfWeek)) {
      console.warn('calendar-update-2');
      updateState(draft => {
        draft.startOfWeek = +weekStart.format('x');
      });
      updateState(draft => {
        draft.currentWeekIndex = row;
      });
      changeWeek(calendar[row]);
    }
  };

  const prevMonth = () => {
    setStartOfMonth(
      draft =>
        (draft.startOfMonth = +moment(startOfMonth)
          .subtract(1, 'month')
          .format('x')),
    );
    setCalendar(draft => {
      draft.calendar = getCalendar(startOfMonth);
    });
  };

  const nextMonth = () => {
    setStartOfMonth(draft => {
      draft.startOfMonth = +moment(startOfMonth).add(1, 'month').format('x');
    });
    setCalendar(draft => {
      draft.calendar = getCalendar(startOfMonth);
    });
  };

  useImperativeHandle(ref, () => ({
    prevWeek: () => {
      if (currentWeekIndex > 0) {
        setCurrentWeek(draft => draft.currentWeekIndex--);
      }
    },
    nextWeek: () => {
      if (currentWeekIndex < 5) {
        setCurrentWeek(draft => draft.currentWeekIndex++);
      }
    },
  }));

  useEffect(() => {
    if (moment(startOfMonth).isSame(moment(selectedDate).startOf('month'))) {
      changeWeek(calendar[currentWeekIndex]);
    }
  }, [startOfMonth, selectedDate, calendar, currentWeekIndex, changeWeek]);

  const renderTableHead = () => {
    return (
      <tr>
        {['日', '一', '二', '三', '四', '五', '六'].map((name, idx) => {
          return (
            <Th as="th" key={idx}>
              {name}
            </Th>
          );
        })}
      </tr>
    );
  };

  const renderTableBody = () =>
    calendar.map((week, row) => {
      return (
        <tr key={row}>
          {week.map((unix, col) => {
            const isToday = unix === todayUnix.current;
            const isCurrentMonth =
              +moment(unix).startOf('month').format('x') === startOfMonth;
            const isActive = unix === selectedDate;
            return (
              <Td key={col}>
                <CalendarCell
                  unix={unix}
                  isToday={isToday}
                  isCurrentMonth={isCurrentMonth}
                  isActive={isActive}
                  onClick={handleClickCell}
                />
              </Td>
            );
          })}
        </tr>
      );
    });

  return (
    <Container>
      <CalendarHeader>
        <MonthHeader>{moment(startOfMonth).format('YYYY年 MM月')}</MonthHeader>

        <ButtonGroup width="66">
          <MonthButton width={30} border onClick={() => prevMonth()}>
            <ChevronLeft color={themeContext.textColor} size={14} />
          </MonthButton>
          <MonthButton width={30} border onClick={() => nextMonth()}>
            <ChevronRight color={themeContext.textColor} size={14} />
          </MonthButton>
        </ButtonGroup>
      </CalendarHeader>

      <div style={{ position: 'relative' }}>
        <WeekBg translateY={currentWeekIndex * 36 + 1 + 'px'}></WeekBg>
        <table>
          <thead>{renderTableHead()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </Container>
  );
};

function getCalendar(unix) {
  let calendar = [];
  const date = moment(unix);

  const startDay = date.clone().startOf('month').startOf('week');
  const endDay = date.clone().endOf('month').endOf('week');

  let tempDate = startDay.clone().subtract(1, 'day');

  while (tempDate.isBefore(endDay, 'day') || !calendar[5]) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => +tempDate.add(1, 'day').format('x')),
    );
  }

  return calendar;
}

function getRow(unix, startDayUnix) {
  console.warn('getRow', unix, startDayUnix);
  const startDay = moment(startDayUnix).startOf('month').startOf('week');
  let row = Math.ceil(
    (moment(unix).startOf('day').diff(startDay, 'days') + 0.1) / 7,
  );
  row = row <= 0 ? 0 : row - 1;
  return row;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: transparent;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarHeader = styled.div`
  width: 100%;
  padding: 16px 7px 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MonthHeader = styled.div`
  font-weight: 600;
  text-align: left;
  margin: 0 10px;
  flex: 1;
`;

const MonthButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeekBg = styled.div.attrs(props => ({
  style: {
    transform: `translateY(${props.translateY})`,
  },
}))`
  position: absolute;
  top: 37px;
  left: 0;
  width: 100%;
  height: 34px;
  border-radius: 8px;
  background-color: ${props => props.theme.primaryColorSecondary};
  transition: transform ease 0.1s;
  z-index: -1;
`;

const Td = styled.td`
  width: 34px;
  height: 34px;
  font-size: ${props => props.theme.fontSize};
  font-weight: 500;
  color: ${props => props.theme.textColor};
`;

const Th = styled(Td)`
  color: ${props => props.theme.textColorSecondary};
`;

export default forwardRef(Calendar);
