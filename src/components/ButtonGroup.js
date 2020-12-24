import styled from "styled-components";

const ButtonGroup = styled.div`
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default ButtonGroup;
