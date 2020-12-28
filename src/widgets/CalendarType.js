import styled from 'styled-components';
import { Switch } from '../components';

const CalendarType = props => {
  return (
    <Container>
      <h2>2020年 12月</h2>
      <Switch></Switch>
    </Container>
  );
};

const Container = styled.div`
  height: 88px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
`;

export default CalendarType;
