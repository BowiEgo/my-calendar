import styled from 'styled-components';

const Button = ({
  width,
  height,
  circle,
  border,
  fontWeight,
  fontSize,
  color,
  backgroundColor,
  hoverColor,
  children,
  onClick,
}) => {
  const w = width ? width + 'px' : 'auto';
  const h = height ? height + 'px' : w;

  return (
    <Container
      width={w}
      height={h}
      circle={circle}
      border={border}
      fontWeight={fontWeight}
      fontSize={fontSize}
      color={color}
      backgroundColor={backgroundColor}
      hoverColor={hoverColor}
      onClick={onClick}
    >
      {children}
    </Container>
  );
};

const Container = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height};
  border: ${props => (props.border ? '1px solid #e8e3f7' : 'none')};
  border-radius: ${props => (props.circle ? '50%' : '4px')};
  background-color: ${props => props.backgroundColor || 'transparent'};
  color: ${props => props.color || 'black'};
  font-weight: ${props => props.fontWeight || 500};
  font-size: ${props => props.fontSize + 'px' || '12px'};
  &:hover {
    background-color: ${props => props.hoverColor || '#efe9ff'};
  }
`;

export default Button;
