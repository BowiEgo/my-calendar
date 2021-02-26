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
import useWeekBarMotion from './useWeekBarMotion';
import useHistory from '../../utils/useHistory';

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

const Calendar = forwardRef(
  (
    {
      onChange,
      onChangeWeek,
      type = 'default',
      width,
      fontSize,
      small = false,
    },
    ref,
  ) => {
    // context
    const themeContext = useContext(ThemeContext);

    // state
    const [
      { calendar, startOfSelectedCalendar, indexOfSelectedWeek },
      updateState,
    ] = useImmer(initialState);

    // ref
    const containerRef = useRef(ref);
    const todayUnix = useRef(+moment().startOf('day').format('x'));
    const selectedDate = useRef();
    const startOfCurrentMonth = useRef(startOfCurrentMonthTmp);
    const initialWeekIndex = useRef(-1);

    // history
    const {
      present: startOfSelectedWeek,
      update: updateSSW,
      getPast: getPastOfSSW,
    } = useHistory(calendarTmp[indexOfSelectedWeekTmp][0], { size: 2 });

    // motion
    const { motion, motionProps, motionHandlers } = useWeekBarMotion({
      pos: indexOfSelectedWeek + 1,
      initialPos: initialWeekIndex.current + 1,
      fixY: 2,
      resolveFn: () => {},
    });

    useEffect(() => {
      if (indexOfSelectedWeek > -1) {
        onChangeWeek && onChangeWeek(calendar[indexOfSelectedWeek]);
      }
    }, [indexOfSelectedWeek, calendar, onChangeWeek]);

    // method
    const prevMonth = startOfWeek => {
      startOfCurrentMonth.current = +moment(startOfCurrentMonth.current)
        .subtract(1, 'month')
        .format('x');

      updateCalendar(startOfWeek);
    };

    const nextMonth = startOfWeek => {
      startOfCurrentMonth.current = +moment(startOfCurrentMonth.current)
        .add(1, 'month')
        .format('x');

      updateCalendar(startOfWeek);
    };

    const updateCalendar = startOfWeek => {
      const { calendar, weekIndex } = getCalendar(
        startOfCurrentMonth.current,
        startOfWeek || startOfSelectedWeek,
      );

      initialWeekIndex.current = startOfWeek
        ? findWeekIndexByStart(getPastOfSSW(1)[0], calendar)
        : weekIndex;

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

        if (weekStartUnix !== startOfSelectedWeek) {
          const row = getRow(unix, startOfCurrentMonth.current);

          updateSSW(weekStartUnix);
          updateState(draft => {
            draft.startOfSelectedCalendar = calendar[0][0];
            draft.indexOfSelectedWeek = row;
          });
        }
      },
      [calendar, startOfSelectedWeek, onChange, updateState, updateSSW],
    );

    useImperativeHandle(ref, () => ({
      prevWeek: () => {
        if (indexOfSelectedWeek > 0) {
          initialWeekIndex.current = indexOfSelectedWeek;
          updateState(draft => {
            draft.indexOfSelectedWeek--;
            updateSSW(calendar[draft.indexOfSelectedWeek][0]);
          });
        } else {
          let startOfWeek = +moment(calendar[0][0])
            .subtract(1, 'week')
            .format('x');

          updateSSW(startOfWeek);
          prevMonth(startOfWeek);
        }
      },
      nextWeek: () => {
        if (indexOfSelectedWeek < 5) {
          initialWeekIndex.current = indexOfSelectedWeek;
          updateState(draft => {
            draft.indexOfSelectedWeek++;
            updateSSW(calendar[draft.indexOfSelectedWeek][0]);
          });
        } else {
          let startOfWeek = +moment(calendar[5][0]).add(1, 'week').format('x');

          updateSSW(startOfWeek);
          nextMonth(startOfWeek);
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
                <Td
                  key={col}
                  small={small}
                  width={width ? width / 7 : null}
                  fontSize={fontSize ? fontSize + 'px' : '14px'}
                >
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
      <Container ref={containerRef} width={width}>
        <CalendarHeader height={width ? width / 7 : null}>
          <MonthHeader>
            {moment(startOfCurrentMonth.current).format('YYYY年 MM月')}
          </MonthHeader>

          <ButtonGroup width="66">
            <MonthButton
              width={width ? width / 7 : 30}
              border
              onClick={() => prevMonth()}
            >
              <ChevronLeft color={themeContext.textColor} size={14} />
            </MonthButton>
            <MonthButton
              width={width ? width / 7 : 30}
              border
              onClick={() => nextMonth()}
            >
              <ChevronRight color={themeContext.textColor} size={14} />
            </MonthButton>
          </ButtonGroup>
        </CalendarHeader>

        <div style={{ position: 'relative' }}>
          <motion.div {...motionProps}>
            {type === 'default' && (
              <WeekBar
                visible={indexOfSelectedWeek > -1}
                height={width ? width / 7 : null}
              ></WeekBar>
            )}
          </motion.div>
          <table>
            <thead>{renderTableHead()}</thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </Container>
    );
  },
);

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

function findWeekIndexByStart(startOfWeek, calendar) {
  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i][0] === startOfWeek) {
      return i;
    }
  }
}

const Container = styled.div`
  position: relative;
  width: ${props => (props.width > 0 ? props.width + 'px' : '100%')};
  background-color: transparent;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarHeader = styled.div`
  width: 100%;
  // padding-left: 16px 7px 10px 0;
  height: ${props => (props.height ? props.height + 'px' : '30px')};
  margin-bottom: ${props => (props.height ? '0' : '10px')};
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

const WeekBar = styled.div.attrs(props => ({
  style: {
    display: props.visible ? 'block' : 'none',
    height: props.height || '34px',
    backgroundColor: props.theme.primaryColorSecondary,
  },
}))`
  width: 100%;
  border-radius: 8px;
  z-index: -1;
`;

const Td = styled.td.attrs(props => ({
  style: {
    width: props.width || '34px',
    height: props.width || '34px',
    fontSize: props.fontSize,
    color: props.theme.textColor,
  },
}))`
  font-weight: 500;
`;

const Th = styled(Td)`
  color: ${props => props.theme.textColorSecondary};
`;

export default Calendar;
