import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Search, Search as SearchIcon } from 'react-feather';

const SearchBar = props => {
  const themeContext = useContext(ThemeContext);

  return (
    <Container>
      <Input placeholder="搜索"></Input>
      <SearchButton>
        <SearchIcon size={13} color={themeContext.textColor}></SearchIcon>
      </SearchButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
`;

const Input = styled.input`
  width: 160px;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  outline: none;
  font-size: 12px;
`;

const SearchButton = styled.div`
  width: 32px;
  height: 32px;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default SearchBar;
