import styled from 'styled-components';

const NavBar = props => {
  return <Container></Container>;
};

const Container = styled.div`
  height: 72px;
  border-bottom: ${props => `1px solid ${props.theme.borderColor}`};
`;

export default NavBar;
