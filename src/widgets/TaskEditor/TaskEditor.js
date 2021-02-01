import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from '../../components';

const TaskEditor = ({ theme }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Container>
      <Input></Input>
      <Input></Input>
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
      >
        Create Activity
      </Button>
    </Container>
  );
};

const Container = styled.div`
  width: 180px;
  padding: 10px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  margin: 14px 0;
  outline: none;
  border: none;
  border-bottom: 1px solid ${props => props.theme.borderColor};
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
