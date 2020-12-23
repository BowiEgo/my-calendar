import { useState } from "react";
import moment from "moment";
import "./Calendar.css";
import CalendarCell from "./CalendarCell";
import { ChevronLeft, ChevronRight } from "react-feather";

export default (props) => {
  const date = moment();
  const [startDay, setStartDay] = useState(date.startOf("month").clone());
  const [calendar, setCalendar] = useState(getCalendar(date));

  const wl = ["日", "一", "二", "三", "四", "五", "六"].map((name, idx) => {
    return <th key={idx}>{name}</th>;
  });

  const cl = calendar.map((week, widx) => {
    return (
      <tr key={widx}>
        {week.map((day, didx) => {
          return (
            <td key={didx}>
              <CalendarCell day={day} startDay={startDay}></CalendarCell>
            </td>
          );
        })}
      </tr>
    );
  });

  const prevMonth = () => {
    setStartDay(startDay.subtract(1, "month").clone());
    setCalendar(getCalendar(startDay));
  };

  const nextMonth = () => {
    setStartDay(startDay.add(1, "month").clone());
    setCalendar(getCalendar(startDay));
  };

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
            {startDay.format("YYYY年 MM月")}
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
      <table>
        <thead>
          <tr>{wl}</tr>
        </thead>
        <tbody>{cl}</tbody>
      </table>
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
