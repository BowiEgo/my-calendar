import styled from 'styled-components';
import { Switch, BackForwardSwitch } from '../../components';

const CalendarType = ({ onChange, onPrev, onNext }) => {
  const handleChangeType = type => {
    onChange(type);
  };

  return (
    <Container>
      <h2>2020年 12月</h2>
      <Switch changeType={handleChangeType}></Switch>
      <BackForwardSwitch onPrev={onPrev} onNext={onNext}></BackForwardSwitch>
    </Container>
  );
};

const Container = styled.div`
  height: 88px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default CalendarType;
