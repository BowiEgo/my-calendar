import "./CalendarList.css";
import { ChevronDown, Plus, Square, CheckSquare } from "react-feather";

const CalendarList = (props) => {
  return (
    <div className="calendar-list">
      <div className="calendar-list-header">
        <h5>我的日历</h5>
        <div className="button-group">
          <button>
            <Plus
              className="button add"
              color="rgb(160, 160, 160)"
              size={20}
            ></Plus>
          </button>
          <button>
            <ChevronDown
              className="button open"
              color="rgb(160, 160, 160)"
              size={20}
            ></ChevronDown>
          </button>
        </div>
      </div>
      <ul>
        <li>
          <CheckSquare
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          ></CheckSquare>
          <span>生日</span>
        </li>
        <li>
          <Square
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          ></Square>
          <span>提醒</span>
        </li>
        <li>
          <Square
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          ></Square>
          <span>提醒</span>
        </li>
        <li>
          <Square
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          ></Square>
          <span>提醒</span>
        </li>
      </ul>
    </div>
  );
};

export default CalendarList;
