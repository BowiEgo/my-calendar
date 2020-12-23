import "./CalendarGrid.css";
import moment from "moment";

moment.locale("zh-cn");

const CalendarGrid = (props) => {
  const { selectedDate, week } = props;
  const weekdaysShort = moment.weekdaysShort();

  const wl = week.map((date, idx) => {
    let className = "week-cell";

    if (date.isSame(selectedDate)) {
      className += " active";
    }
    return (
      <div className={className} key={idx}>
        <span>{weekdaysShort[date.weekday()]}</span>
        <h1>{date.date()}</h1>
      </div>
    );
  });

  return (
    <div className="calendar-grid">
      <div className="calendar-grid-week">
        <div className="week">{wl}</div>
      </div>
      <div className="calendar-grid-content">
        <div className="calendar-grid-label"></div>
        <div className="calendar-grid-table"></div>
      </div>
    </div>
  );
};

export default CalendarGrid;
