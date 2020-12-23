import "./CalendarCell.css";
import moment from "moment";

const CalendarCell = (props) => {
  const { date } = props;
  let className = "calendar-cell";

  if (!date) {
    return <div></div>;
  }

  const today = moment().startOf("day").clone();

  if (today.isSame(date)) {
    className += " today";
  }
  if (date.month() !== props.startDay.month()) {
    className += " not-same-month";
  }
  if (props.isActive) {
    className += " active";
  }

  const handleClick = () => {
    props.onClick(date);
  };

  return (
    <div className="calendar-cell-container" onClick={() => handleClick()}>
      <div className={className}>{date.date()}</div>
    </div>
  );
};

export default CalendarCell;
