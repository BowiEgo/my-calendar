import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Button } from '../index';

const BackForwardSwitch = ({ onPrev, onNext }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Container>
      <Button
        width={30}
        height={32}
        backgroundColor={themeContext.primaryColorSecondary}
        hoverColor={themeContext.primaryColorSecondary}
        onClick={onPrev}
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
        onClick={onNext}
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
