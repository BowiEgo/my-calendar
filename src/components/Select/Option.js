import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import SelectContext from './SelectContext';

const Option = ({ value, children }) => {
  const { setSelectedValue } = useContext(SelectContext);

  const handleClick = useCallback(() => {
    setSelectedValue(value);
  }, [value, setSelectedValue]);

  return <Container onClick={handleClick}>{children}</Container>;
};

const Container = styled.div`
  text-align: center;
  transition: ease all 0.1s;
  &:hover {
    background-color: #ececec;
  }
`;

export default Option;
