import styled from 'styled-components';
import { SearchBar } from './index.js';

const NavBar = props => {
  return (
    <Container>
      <Tabs></Tabs>
      <SearchBar></SearchBar>
    </Container>
  );
};

const Container = styled.div`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${props => `1px solid ${props.theme.borderColor}`};
`;

const Tabs = styled.div`
  width: 400px;
  height: 100%;
  background-color: #673abd1c;
`;

export default NavBar;
