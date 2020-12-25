import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  border: ${props => (props.border ? '1px solid #e8e3f7' : 'none')};
  border-radius: 4px;
  background-color: transparent;
  &:hover {
    background-color: #efe9ff;
  }
`;

export default Button;
