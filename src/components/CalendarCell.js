import "./CalendarCell.css";
import moment from "moment";

export default (props) => {
  let className = "calendar-cell";

  if (!props.day) {
    return <div></div>;
  }

  const today = moment().startOf("day");

  if (today.diff(props.day, "days") === 0) {
    className += " today";
  }
  if (props.day.month() !== props.startDay.month()) {
    className += " not-same-month";
  }

  const handleClick = (day) => {
    console.log(day);
  };

  return (
    <div className={className} onClick={() => handleClick(props.day)}>
      {props.day.date()}
    </div>
  );
};
