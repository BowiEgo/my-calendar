import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Button } from '../components';
import { useSelector, useDispatch } from 'react-redux';

const BackForwardSwitch = props => {
  const themeContext = useContext(ThemeContext);

  const weekSwitchStatus = useSelector(state => state.weekSwitchStatus);
  const dispatch = useDispatch();

  const prevWeek = () => {
    if (weekSwitchStatus !== 'static') {
      return;
    }
    dispatch({
      type: 'CHANGE_WEEK_SWITCH_STATUS',
      payload: {
        weekSwitchStatus: 'prev',
      },
    });
  };

  const nextWeek = () => {
    if (weekSwitchStatus !== 'static') {
      return;
    }
    dispatch({
      type: 'CHANGE_WEEK_SWITCH_STATUS',
      payload: {
        weekSwitchStatus: 'next',
      },
    });
  };

  return (
    <Container>
      <Button
        width={30}
        height={32}
        backgroundColor={themeContext.primaryColorSecondary}
        hoverColor={themeContext.primaryColorSecondary}
        onClick={prevWeek}
      >
        <ChevronLeft color={themeContext.textColor} size={14} />
      </Button>
      <Button
        width={90}
        height={32}
        fontWeight={600}
        backgroundColor={themeContext.primaryColorSecondary}
        hoverColor={themeContext.primaryColorSecondary}
      >
        Today
      </Button>
      <Button
        width={30}
        height={32}
        backgroundColor={themeContext.primaryColorSecondary}
        hoverColor={themeContext.primaryColorSecondary}
        onClick={nextWeek}
      >
        <ChevronRight color={themeContext.textColor} size={14} />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  width: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
`;

export default BackForwardSwitch;
