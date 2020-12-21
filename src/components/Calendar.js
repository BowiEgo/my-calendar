import "./Calendar.css";
import moment from "moment";

export default (props) => {
  const wl = ["日", "一", "二", "三", "四", "五", "六"].map((name, idx) => {
    return <th key={idx}>{name}</th>;
  });

  const calendar = getCalendar(moment());

  const cl = calendar.map((week, widx) => {
    return (
      <tr key={widx}>
        {week.map((day, didx) => {
          return <td key={didx}>{day.date()}</td>;
        })}
      </tr>
    );
  });

  return (
    <div className="calendar">
      <table>
        <thead>
          <tr>{wl}</tr>
        </thead>
        <tbody>{cl}</tbody>
      </table>
    </div>
  );
};

function getCalendar(time) {
  const days = time.daysInMonth();
  const startOfMonth = time.startOf("month");

  let array = new Array(6);
  let week = 0;
  let tempDate;

  for (let i = 1; i <= days; i++) {
    if (i === 1) {
      tempDate = startOfMonth;
      array[week] = new Array(7).fill(time);
    }

    let tempDay = tempDate.day();
    if (tempDay === 0) {
      week++;
      array[week] = new Array(7).fill(time);
    }

    array[week][tempDay] = moment(tempDate);
    tempDate.add(1, "d");
  }

  return array;
}
