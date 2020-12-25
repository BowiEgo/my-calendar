import styled from 'styled-components';
import { ChevronDown, Plus, Square, CheckSquare } from 'react-feather';
import { Button, ButtonGroup } from '../components';

const CalendarList = props => {
  return (
    <Container>
      <ListHeader>
        <h5>我的日历</h5>
        <ButtonGroup>
          <Button>
            <Plus className="button add" color="rgb(160, 160, 160)" size={20} />
          </Button>
          <Button>
            <ChevronDown
              className="button open"
              color="rgb(160, 160, 160)"
              size={20}
            />
          </Button>
        </ButtonGroup>
      </ListHeader>
      <ul>
        <li>
          <CheckSquare
            className="button add"
            color="rgb(160, 160, 160)"
            size={20}
          />
          <span>生日</span>
        </li>
        <li>
          <Square className="button add" color="rgb(160, 160, 160)" size={20} />
          <span>提醒</span>
        </li>
        <li>
          <Square className="button add" color="rgb(160, 160, 160)" size={20} />
          <span>提醒</span>
        </li>
        <li>
          <Square className="button add" color="rgb(160, 160, 160)" size={20} />
          <span>提醒</span>
        </li>
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
