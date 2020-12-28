import styled from 'styled-components';
import { ChevronDown, Plus, Square, CheckSquare } from 'react-feather';
import { Button } from '../components';

const CalendarList = props => {
  return (
    <Container>
      <ListHeader>
        <h5>分类</h5>
        <Button circle border width={30}>
          <Plus color="rgb(160, 160, 160)" size={12} />
        </Button>
      </ListHeader>
      <ul>
        <ListItem>
          <CheckSquare
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          />
          <span>日常</span>
        </ListItem>
        <ListItem>
          <Square className="button add" color="rgb(160, 160, 160)" size={20} />
          <span>工作</span>
        </ListItem>
        <ListItem>
          <Square className="button add" color="rgb(160, 160, 160)" size={20} />
          <span>节日</span>
        </ListItem>
      </ul>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 40px;
  margin-top: 20px;
  padding-bottom: 20px;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  h5 {
    font-size: 16px;
    display: inline-block;
    line-height: 40px;
    margin: 0;
  }
`;

const ListItem = styled.li`
  font-size: 12px;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &:hover {
    background-color: whitesmoke;
  }
  span {
    margin-left: 10px;
  }
`;

export default CalendarList;
