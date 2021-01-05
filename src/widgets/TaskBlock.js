import styled from 'styled-components';

const TaskBlock = props => {
  return (
    <Container
      top={props.top}
      height={props.height}
      float={props.float}
    ></Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 4px;
  width: calc(100% - 8px);
  height: ${props => props.height + 'px'};
  background-color: #d6ebfd;
  box-shadow: ${props =>
    props.float
      ? `0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
      : 'none'};
  transform: ${props => `translate3d(${props.top} 0 0`};
`;

export default TaskBlock;
