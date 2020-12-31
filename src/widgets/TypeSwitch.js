import { useState, useMemo } from 'react';
import styled from 'styled-components';

const typeArr = ['Week', 'Month', 'Year'];

const Switch = props => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const translateX = useMemo(() => {
    return selectedIdx * 90;
  }, [selectedIdx]);

  const changeSeleted = index => {
    setSelectedIdx(index);
    props.changeType(typeArr[selectedIdx]);
  };

  return (
    <Container>
      <SwitchBlock translateX={translateX}></SwitchBlock>
      {typeArr.map((type, index) => {
        return (
          <SwitchButton
            isSelectedSibling={Math.abs(index - selectedIdx) <= 1}
            isPrevSibling={index < selectedIdx}
            key={index}
            onClick={() => changeSeleted(index)}
          >
            {type}
          </SwitchButton>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  background-color: ${props => props.theme.primaryColorSecondary};
  border-radius: 6px;
`;

const SwitchButton = styled.div`
  cursor: pointer;
  position: relative;
  width: 90px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  &::before {
    position: absolute;
    top: 50%;
    left: ${props => (props.isPrevSibling ? '100%' : '0')};
    transform: translateY(-50%);
    display: block;
    opacity: ${props => (props.isSelectedSibling ? '0' : '100%')};
    content: '';
    width: 1px;
    height: 12px;
    background-color: #ddd8ea;
    transition: opacity ease 0.4s;
  }
  &:first-child::before {
    display: none;
  }
`;

const SwitchBlock = styled.div`
  width: 86px;
  height: calc(100% - 4px);
  position: absolute;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 4px;
  transform: translateX(${props => props.translateX + 'px'});
  transition: transform ease 0.2s;
`;

export default Switch;
