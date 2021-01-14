import styled from 'styled-components';
import { BackForwardSwitch, TypeSwitch } from './index.js';

const CalendarType = props => {
  const handleChangeType = type => {
    props.changeType(type);
  };

  return (
    <Container>
      <h2>2020年 12月</h2>
      <TypeSwitch changeType={handleChangeType}></TypeSwitch>
      <BackForwardSwitch></BackForwardSwitch>
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
