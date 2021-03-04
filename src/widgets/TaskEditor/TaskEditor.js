import { useRef, useCallback, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button, CalendarInput, Select, Option } from '../../components';
import moment from 'moment';

function getOptions() {
  const timeGap = 15 * 60 * 1000;
  const timeNum = (24 * 60 * 60 * 1000) / timeGap;
  let timeData = Array(timeNum).fill(0);
  let i = -1;
  timeData = timeData.map(() => {
    i++;
    return i * timeGap;
  });
  return timeData.map(seconds => {
    return {
      label: moment(seconds).format('hh:mm'),
      unix: seconds,
    };
  });
}

const TaskEditor = ({ lastSelectedDate, onDateChange, onClickCreate } = {}) => {
  const timeOptions = useRef(getOptions());

  const themeContext = useContext(ThemeContext);

  const handleDateChange = useCallback(
    (unix, week) => {
      onDateChange && onDateChange(unix, week);
    },
    [onDateChange],
  );

  const handleStartTimeChanged = useCallback(value => {
    console.log('handleStartTimeChanged', value);
  }, []);

  const handleEndTimeChanged = useCallback(value => {
    console.log('handleEndTimeChanged', value);
  }, []);

  return (
    <Container>
      <TitleInput type={'text'} placeholder={'添加标题'}></TitleInput>
      <CalendarInput
        selectedDate={lastSelectedDate}
        onChange={handleDateChange}
      ></CalendarInput>
      <SelectGroup>
        <Select
          width={90}
          defaultValue={timeOptions.current[0].unix}
          onChange={handleStartTimeChanged}
        >
          {timeOptions.current.map((time, index) => (
            <Option key={index} value={time.unix}>
              {time.label}
            </Option>
          ))}
        </Select>
        <Select
          width={90}
          defaultValue={timeOptions.current[0].unix}
          onChange={handleEndTimeChanged}
        >
          {timeOptions.current.map((time, index) => (
            <Option key={index} value={time.unix}>
              {time.label}
            </Option>
          ))}
        </Select>
      </SelectGroup>
      <CategoryList>
        <Category color={'#ffad19'} bgColor={'#fff4e0'}>
          Work
        </Category>
        <Category color={'#861be8'} bgColor={'#f1e4ff'}>
          Clients Projects
        </Category>
        <Category color={'#1955ff'} bgColor={'#ddecff'}>
          Personal Projects
        </Category>
      </CategoryList>
      {/* <Divider></Divider> */}
      {/* <ContactList></ContactList> */}
      <Button
        width={160}
        height={30}
        fontSize={12}
        color={'white'}
        backgroundColor={themeContext.primaryColor}
        hoverColor={themeContext.primaryColor}
        onClick={onClickCreate}
      >
        Create Activity
      </Button>
    </Container>
  );
};

const Container = styled.div`
  width: 220px;
  padding: 10px 20px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 14px;
  outline: none;
  border: none;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const TitleInput = styled(Input)`
  font-size: 14px;
  font-weight: 600;
  line-height: 40px;
  color: #000;
`;

const SelectGroup = styled.div`
  margin-top: 14px;
  display: flex;
`;

const Divider = styled.div`
  width: 160px;
  height: 1px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const CategoryList = styled.ul`
  margin: 14px 0;
  display: flex;
  flex-wrap: wrap;
`;

const Category = styled.li.attrs(props => ({
  style: {
    color: props.color,
    backgroundColor: props.bgColor,
  },
}))`
  display: inline-block;
  padding: 0 10px;
  margin-right: 6px;
  margin-bottom: 6px;
  height: 28px;
  line-height: 28px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
`;

const ContactList = styled.ul`
  height: 40px;
  display: flex;
  align-items: center;
`;

export default TaskEditor;
