import {
  useRef,
  useEffect,
  useMemo,
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
const nowMoment = moment(nowUnix);
const startOfCurrentMonthTmp = +nowMoment.clone().startOf('month').format('x');
const {
  calendar: calendarTmp,
  weekIndex: indexOfSelectedWeekTmp,
} = getCalendar(nowUnix, +nowMoment.clone().startOf('day').format('x'));

const initialState = {
  calendar: calendarTmp,
  startOfSelectedCalendar: null,
  indexOfSelectedWeek: indexOfSelectedWeekTmp,
};

const Calendar = forwardRef(({ onChange, onChangeWeek }, ref) => {
  // context
  const themeContext = useContext(ThemeContext);

  // state
  const [
    { calendar, startOfSelectedCalendar, indexOfSelectedWeek },
    updateState,
  ] = useImmer(initialState);

  // ref
  const todayUnix = useRef(+moment().startOf('day').format('x'));
  const selectedDate = useRef();
  const startOfCurrentMonth = useRef(startOfCurrentMonthTmp);
  const startOfSelectedWeek = useRef(calendarTmp[indexOfSelectedWeekTmp][0]);

  useEffect(() => {
    if (indexOfSelectedWeek > -1) {
      onChangeWeek && onChangeWeek(calendar[indexOfSelectedWeek]);
    }
  }, [indexOfSelectedWeek, onChangeWeek]);

  // method
  const prevMonth = () => {
    startOfCurrentMonth.current = +moment(startOfCurrentMonth.current)
      .subtract(1, 'month')
      .format('x');

    updateCalendar();
  };

  const nextMonth = () => {
    startOfCurrentMonth.current = +moment(startOfCurrentMonth.current)
      .add(1, 'month')
      .format('x');

    updateCalendar();
  };

  const updateCalendar = () => {
    const { calendar, weekIndex } = getCalendar(
      startOfCurrentMonth.current,
      startOfSelectedWeek.current,
    );

    updateState(draft => {
      draft.indexOfSelectedWeek = weekIndex;
      draft.calendar = calendar;
    });
  };

  const handleCellClicked = useCallback(
    unix => {
      if (unix === selectedDate.current) return;
      selectedDate.current = unix;
      onChange && onChange(unix);

      const weekStartUnix = +moment(unix).startOf('week').format('x');
      if (weekStartUnix !== startOfSelectedWeek.current) {
        const row = getRow(unix, startOfCurrentMonth.current);

        startOfSelectedWeek.current = weekStartUnix;
        updateState(draft => {
          draft.startOfSelectedCalendar = calendar[0][0];
          draft.indexOfSelectedWeek = row;
        });
      }
    },
    [calendar, onChange, updateState],
  );

  useImperativeHandle(ref, () => ({
    prevWeek: () => {
      if (indexOfSelectedWeek > 0) {
        updateState(draft => {
          draft.indexOfSelectedWeek--;
        });
      } else {
        startOfSelectedWeek.current = +moment(calendar[0][0])
          .subtract(1, 'week')
          .format('x');
        prevMonth();
      }
    },
    nextWeek: () => {
      if (indexOfSelectedWeek < 5) {
        updateState(draft => {
          draft.indexOfSelectedWeek++;
        });
      } else {
        startOfSelectedWeek.current = +moment(calendar[5][0])
          .add(1, 'week')
          .format('x');
        nextMonth();
      }
    },
  }));

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
              +moment(unix).startOf('month').format('x') ===
              startOfCurrentMonth.current;
            const isActive = unix === selectedDate.current;
            return (
              <Td key={col}>
                <CalendarCell
                  unix={unix}
                  isToday={isToday}
                  isCurrentMonth={isCurrentMonth}
                  isActive={isActive}
                  onClick={handleCellClicked}
                />
              </Td>
            );
          })}
        </tr>
      );
    });

  return (
    <Container ref={ref}>
      <CalendarHeader>
        <MonthHeader>
          {moment(startOfCurrentMonth.current).format('YYYY年 MM月')}
        </MonthHeader>

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
        <WeekBg
          visible={indexOfSelectedWeek > -1}
          translateY={indexOfSelectedWeek * 36 + 1}
        ></WeekBg>
        <table>
          <thead>{renderTableHead()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </Container>
  );
});

function getCalendar(unix, startOfWeekUnix) {
  let calendar = [];
  let weekIndex = -1;
  let idx = 0;
  const date = moment(unix);

  const startDay = date.clone().startOf('month').startOf('week');
  const endDay = date.clone().endOf('month').endOf('week');

  let tempDate = startDay.clone().subtract(1, 'day');

  while (tempDate.isBefore(endDay, 'day') || !calendar[5]) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => {
          const d = +tempDate.add(1, 'day').format('x');
          if (d === startOfWeekUnix) {
            weekIndex = idx;
          }
          return d;
        }),
    );
    idx++;
  }

  return { calendar, weekIndex };
}

function getRow(unix, startDayUnix) {
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
    display: props.visible ? 'block' : 'none',
    transform: `translateY(${props.translateY}px)`,
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

export default Calendar;
