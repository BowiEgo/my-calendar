import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useContext,
} from 'react';
import styled, { ThemeContext } from 'styled-components';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Button, ButtonGroup } from '../components';
import { CalendarCell } from '../widgets';

const Calendar = ({ change, changeWeek }, ref) => {
  const themeContext = useContext(ThemeContext);

  const [startOfMonth, setStartOfMonth] = useState(
    moment().startOf('month').clone(),
  );
  const [startOfWeek, setStartOfWeek] = useState(
    moment().startOf('week').clone(),
  );
  const [calendar, setCalendar] = useState(getCalendar(moment()));
  const [currentWeek, setCurrentWeek] = useState(
    getRow(moment(), startOfMonth),
  );
  const [currentDate, setCurrentDate] = useState(
    calendar[currentWeek][moment().weekday()],
  );

  useEffect(() => {
    change(currentDate);
    if (startOfMonth.isSame(currentDate.clone().startOf('month'))) {
      changeWeek(calendar[currentWeek]);
    }
  });

  const handleClickCell = date => {
    const d = date.clone();
    const row = getRow(d, startOfMonth);
    const weekStart = d.clone().startOf('week').clone();

    setCurrentDate(calendar[row][d.weekday()]);

    if (!weekStart.isSame(startOfWeek)) {
      changeWeek(calendar[row]);
      setStartOfWeek(weekStart);
      setCurrentWeek(row);
    }
  };

  const prevMonth = () => {
    setStartOfMonth(startOfMonth.subtract(1, 'month').clone());
    setCalendar(getCalendar(startOfMonth));
  };

  const nextMonth = () => {
    setStartOfMonth(startOfMonth.add(1, 'month').clone());
    setCalendar(getCalendar(startOfMonth));
  };

  useImperativeHandle(ref, () => ({
    prevWeek: () => {
      if (currentWeek > 0) {
        setCurrentWeek(currentWeek - 1);
      }
    },
    nextWeek: () => {
      if (currentWeek < 5) {
        setCurrentWeek(currentWeek + 1);
      }
    },
  }));

  const wl = ['日', '一', '二', '三', '四', '五', '六'].map((name, idx) => {
    return (
      <Th as="th" key={idx}>
        {name}
      </Th>
    );
  });

  const cl = calendar.map((week, row) => {
    return (
      <tr key={row}>
        {week.map((date, col) => {
          return (
            <Td key={col}>
              <CalendarCell
                date={date}
                isActive={currentDate.isSame(date)}
                startDay={startOfMonth}
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
        <MonthHeader>{startOfMonth.format('YYYY年 MM月')}</MonthHeader>
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
        <WeekBg translateY={currentWeek * 36 + 1 + 'px'}></WeekBg>
        <table>
          <thead>
            <tr>{wl}</tr>
          </thead>

          <tbody>{cl}</tbody>
        </table>
      </div>
    </Container>
  );
};

function getCalendar(date) {
  let calendar = [];

  const startDay = date.clone().startOf('month').startOf('week');
  const endDay = date.clone().endOf('month').endOf('week');

  let tempDate = startDay.clone().subtract(1, 'day');

  while (tempDate.isBefore(endDay, 'day') || !calendar[5]) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => tempDate.add(1, 'day').clone()),
    );
  }

  return calendar;
}

function getRow(date, startDay) {
  startDay = startDay.clone().startOf('month').startOf('week');
  let row = Math.ceil(
    (date.clone().startOf('day').diff(startDay, 'days') + 0.1) / 7,
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

const WeekBg = styled.div`
  position: absolute;
  top: 37px;
  left: 0;
  width: 100%;
  height: 34px;
  border-radius: 8px;
  background-color: ${props => props.theme.primaryColorSecondary};
  transition: transform ease 0.1s;
  z-index: -1;
  transform: translateY(${props => props.translateY});
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
