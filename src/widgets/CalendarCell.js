import moment from "moment";
import styled from "styled-components";

const CalendarCell = (props) => {
  const { date } = props;

  if (!date) {
    return <div />;
  }

  const today = moment().startOf("day").clone();

  // compute styles
  let backgroundColor = "inherit";
  let textColor = "#333";

  if (date.month() !== props.startDay.month()) {
    textColor = "rgb(160, 160, 160)";
  }

  if (today.isSame(date)) {
    backgroundColor = "rgb(243, 109, 154)";
    textColor = "white";
  }

  if (props.isActive) {
    backgroundColor = primary;
    textColor = "white";
  }

  // functions
  const handleClick = () => {
    props.onClick(date);
  };

  return (
    <CellContainer onClick={() => handleClick()}>
      <Cell backgroundColor={backgroundColor} color={textColor}>
        {date.date()}
      </Cell>
    </CellContainer>
  );
};

const primary = "rgb(85, 68, 228)";

const CellContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  &: hover;
`;

const Cell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  font-family: "Roboto";
`;

export default CalendarCell;
