import styled from 'styled-components';

const Container = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height};
  border: ${props => (props.border ? '1px solid #e8e3f7' : 'none')};
  border-radius: ${props => (props.circle ? '50%' : '4px')};
  background-color: transparent;
  &:hover {
    background-color: #efe9ff;
  }
`;

const Button = props => {
  const { width, height, circle, border } = props;

  const w = props.width ? props.width + 'px' : 'auto';
  const h = props.height ? props.height + 'px' : w;

  return (
    <Container width={w} height={h} circle={circle} border={border}>
      {props.children}
    </Container>
  );
};

export default Button;
