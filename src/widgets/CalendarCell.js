import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import moment from 'moment';

const CalendarCell = props => {
  const themeContext = useContext(ThemeContext);

  const { date } = props;

  if (!date) {
    return <div />;
  }

  const today = moment().startOf('day').clone();

  // compute styles
  let backgroundColor = 'inherit';
  let textColor = themeContext.textColor;

  if (date.month() !== props.startDay.month()) {
    textColor = themeContext.disabledColor;
  }

  if (today.isSame(date)) {
    backgroundColor = themeContext.hightlightColor;
    textColor = 'white';
  }

  if (props.isActive) {
    backgroundColor = themeContext.primaryColor;
    textColor = 'white';
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

const CellContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const Cell = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.backgroundColor,
    color: props.color,
  },
}))`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  font-family: 'Roboto';
`;

export default CalendarCell;
