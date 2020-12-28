import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  background-color: ${props => props.theme.primaryColorSecondary};
  border-radius: 4px;
`;

const SwitchButton = styled.div`
  position: relative;
  width: 80px;
  height: 100%;
  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: block;
    content: '';
    width: 2px;
    height: 14px;
    background-color: ${props => props.theme.borderColor};
  }
  &:first-child::before {
    display: none;
  }
`;

const Switch = props => {
  return (
    <Container>
      <SwitchButton></SwitchButton>
      <SwitchButton></SwitchButton>
      <SwitchButton></SwitchButton>
    </Container>
  );
};

export default Switch;
