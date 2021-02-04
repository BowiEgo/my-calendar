import { memo, useMemo, useRef, useContext, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import moment from 'moment';

const CalendarCell = memo(
  ({ unix, isToday, isCurrentMonth, isActive, onClick }) => {
    // context
    const themeContext = useContext(ThemeContext);

    // memo
    const date = useMemo(() => moment(+unix), [unix]);
    const isRound = useMemo(() => isActive || isToday, [isActive, isToday]);
    const backgroundColor = useMemo(() => {
      if (isActive) {
        return themeContext.primaryColor;
      } else if (isToday) {
        return themeContext.hightlightColor;
      } else {
        return 'inherit';
      }
    }, [isActive, isToday]);

    const textColor = useMemo(() => {
      if (isActive || isToday) {
        return 'white';
      } else if (!isCurrentMonth) {
        return themeContext.disabledColor;
      } else {
        return themeContext.textColor;
      }
    }, [isCurrentMonth, isActive, isToday]);

    // render
    return unix ? (
      <Container onClick={() => onClick(unix)}>
        <Cell
          backgroundColor={backgroundColor}
          color={textColor}
          round={isRound}
        >
          {date.date()}
        </Cell>
      </Container>
    ) : (
      <div />
    );
  },
  (prev, next) => {
    const keys = ['unix', 'isToday', 'isCurrentMonth', 'isActive'];
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (prev[key] !== next[key]) {
        return false;
      }
    }
    return true;
  },
);

const Container = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const Cell = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.backgroundColor,
    color: props.color,
    borderRadius: props.round ? '8px' : 0,
  },
}))`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto';
`;

export default CalendarCell;
