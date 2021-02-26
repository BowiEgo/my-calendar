import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button, CalendarInput } from '../../components';

const TaskEditor = ({ theme, onClickCreate } = {}) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Container>
      <TitleInput type={'text'} placeholder={'添加标题'}></TitleInput>
      <CalendarInput></CalendarInput>
      <Input></Input>
      <TagList></TagList>
      <Divider></Divider>
      <ContactList></ContactList>
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

const Divider = styled.div`
  width: 160px;
  height: 1px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const TagList = styled.ul`
  height: 80px;
`;

const ContactList = styled.ul`
  height: 40px;
  display: flex;
  align-items: center;
`;

export default TaskEditor;
