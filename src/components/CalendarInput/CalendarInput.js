import { useCallback, useContext, useMemo, useRef } from 'react';
import { useImmer } from 'use-immer';
import styled, { ThemeContext } from 'styled-components';
import { Calendar } from '../../widgets';
import useClickOutside from '../../utils/useClickOutside';
import moment from 'moment';

const CalendarInput = ({ selectedDate, onChange }) => {
  const themeContext = useContext(ThemeContext);

  // state
  const [{ date, isOpen }, updateState] = useImmer({ date: 0, isOpen: false });

  const popupRef = useRef();

  const dateStr = useMemo(() => {
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][
      moment(date).day()
    ];
    return moment(date).format('M月DD日') + `(星期${weekDay})`;
  }, [date]);

  useClickOutside(popupRef, () => {
    updateState(draft => {
      draft.isOpen = false;
    });
  });

  const changeSelectedDate = useCallback(
    (unix, week) => {
      updateState(draft => {
        draft.date = unix;
        draft.isOpen = false;
      });

      onChange && onChange(unix, week);
    },
    [updateState],
  );

  const handleInputClick = useCallback(() => {
    updateState(draft => {
      draft.isOpen = true;
    });
  }, [updateState]);

  return (
    <Container>
      <Input onClick={handleInputClick}>{dateStr}</Input>
      {isOpen && (
        <Popup shadow={themeContext.boxShadow} ref={popupRef}>
          <Calendar
            type={'input'}
            width={200}
            fontSize={12}
            date={selectedDate}
            onChange={changeSelectedDate}
          ></Calendar>
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  cursor: text;
`;

const Input = styled.div`
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 2px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  &:hover {
    background-color: #ececec;
  }
`;

const Popup = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  width: 220px;
  border-radius: 3px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 3px 6px 3px rgba(0, 0, 0, 0.1);
  z-index: 9999;
`;

export default CalendarInput;
