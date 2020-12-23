import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import moment from "moment";
import "./Calendar.css";
import CalendarCell from "./CalendarCell";
import { ChevronLeft, ChevronRight } from "react-feather";

let Calendar = (props, ref) => {
  const [startOfMonth, setStartOfMonth] = useState(
    moment().startOf("month").clone()
  );
  const [startOfWeek, setStartOfWeek] = useState(
    moment().startOf("week").clone()
  );
  const [calendar, setCalendar] = useState(getCalendar(moment()));
  const [currentWeek, setCurrentWeek] = useState(
    getRow(moment(), startOfMonth)
  );
  const [currentDate, setCurrentDate] = useState(
    calendar[currentWeek][moment().weekday()]
  );

  useEffect(() => {
    props.change(currentDate);
    if (startOfMonth.isSame(currentDate.clone().startOf("month"))) {
      props.changeWeek(calendar[currentWeek]);
    }
  });

  const handleClickCell = (date) => {
    const d = date.clone();
    const row = getRow(d, startOfMonth);
    console.log("row", row);
    const weekStart = d.clone().startOf("week").clone();

    setCurrentDate(calendar[row][d.weekday()]);

    if (!weekStart.isSame(startOfWeek)) {
      props.changeWeek(calendar[row]);
      setStartOfWeek(weekStart);
      setCurrentWeek(row);
    }
  };

  const prevMonth = () => {
    setStartOfMonth(startOfMonth.subtract(1, "month").clone());
    setCalendar(getCalendar(startOfMonth));
  };

  const nextMonth = () => {
    setStartOfMonth(startOfMonth.add(1, "month").clone());
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

  const wl = ["日", "一", "二", "三", "四", "五", "六"].map((name, idx) => {
    return <th key={idx}>{name}</th>;
  });

  const cl = calendar.map((week, row) => {
    return (
      <tr key={row}>
        {week.map((date, col) => {
          return (
            <td key={col}>
              <CalendarCell
                date={date}
                isActive={currentDate.isSame(date)}
                startDay={startOfMonth}
                onClick={handleClickCell}
              ></CalendarCell>
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="flex-row">
          <ChevronLeft
            className="button prev-month"
            color="rgb(160, 160, 160)"
            size={20}
            onClick={() => prevMonth()}
          ></ChevronLeft>
          <div style={{ margin: "0 10px" }}>
            {startOfMonth.format("YYYY年 MM月")}
          </div>
          <ChevronRight
            className="button next-month"
            color="rgb(160, 160, 160)"
            size={20}
            onClick={() => nextMonth()}
          ></ChevronRight>
        </div>
        <button className="button today">今天</button>
      </div>
      <div style={{ position: "relative" }}>
        <div
          className="week-bg"
          style={{
            // computed待优化
            transform: `translateY(${currentWeek * 36}px)`,
          }}
        ></div>
        <table>
          <thead>
            <tr>{wl}</tr>
          </thead>

          <tbody>{cl}</tbody>
        </table>
      </div>
    </div>
  );
};

function getCalendar(date) {
  let calendar = [];

  const startDay = date.clone().startOf("month").startOf("week");
  const endDay = date.clone().endOf("month").endOf("week");

  let tempDate = startDay.clone().subtract(1, "day");

  while (tempDate.isBefore(endDay, "day") || !calendar[5]) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => tempDate.add(1, "day").clone())
    );
  }

  return calendar;
}

function getRow(date, startDay) {
  startDay = startDay.clone().startOf("month").startOf("week");
  let row = Math.ceil(
    (date.clone().startOf("day").diff(startDay, "days") + 0.1) / 7
  );
  row = row <= 0 ? 0 : row - 1;
  return row;
}

Calendar = forwardRef(Calendar);

export default Calendar;
