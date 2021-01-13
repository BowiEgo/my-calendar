import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import { _reqFrame } from '../../utils/reqFrame';
import { TaskBlock, TaskBlockSolid } from '../index';

const CalendarGridTable = props => {
  const { week, mousePosition, offset } = props;

  const [blockList, setBlockList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tempBlockTop, setTempBlockTop] = useState(0);
  const [tempBlockHeight, setTempBlockHeight] = useState(0);
  const [currentCol, setCurrentCol] = useState(-1);

  const tableElRef = useRef();
  const tableWidth = useRef();
  // const currentCol = useRef(0);
  const activedCol = useRef(0);
  const activedBlockIndex = useRef(-1);
  const taskTemp = useRef({
    date: null,
    startTime: null,
    endTime: null,
    title: '无标题',
    type: 'work',
    shadow: true,
  });

  const handleMouseDown = e => {
    if (isCreating) {
      console.log('00000');
      setIsDrawing(false);
      initTempBlock();
      return;
    }
    console.log('11111');
    setIsDrawing(true);
    setTempBlockTop(mousePosition.y);
  };

  const handleMouseMove = e => {
    if (isDrawing) {
      setTempBlockHeight(mousePosition.y - tempBlockTop);
    }
    if (activedBlockIndex.current > -1) {
      changeBlockTop();
    }
  };

  const handleMouseUp = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('handleMouseUp', e);
    }
    if (activedBlockIndex.current > -1) {
      disactiveBlock();
    }
    if (isCreating) {
      setIsCreating(false);
      return;
    }
    createTask();
    setIsDrawing(false);
  };

  const handleMouseLeave = e => {
    setIsDrawing(false);
  };

  const handleKeyPress = e => {
    console.log(e);
  };

  const createTask = () => {
    setIsCreating(true);
  };

  const finishResizing = () => {
    handleMouseUp();
  };

  const finishCreateTask = () => {
    setBlockList([
      ...blockList,
      {
        task: cloneDeep(taskTemp.current),
        top: tempBlockTop,
        height: tempBlockHeight,
        actived: false,
        disabled: false,
        moving: false,
      },
    ]);
    setIsCreating(false);
    initTempBlock();
  };

  const initTempBlock = () => {
    setTempBlockTop(0);
    setTempBlockHeight(0);
  };

  const outArea = () => {
    setIsDrawing(false);
  };

  const activeBlock = task => {
    console.log('activeBlock', task);
    activedBlockIndex.current = blockList.findIndex(
      block => block.task === task,
    );
    setTempBlockTop(mousePosition.y - blockList[activedBlockIndex.current].top);
  };

  const disactiveBlock = task => {
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    block.actived = false;
    block.moving = false;
    setBlockList([...newBlockList]);
    activedBlockIndex.current = -1;
  };

  const changeBlockTop = () => {
    console.log('changeBlockTop');
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    if (block.disabled) {
      return;
    }
    block.actived = true;
    block.moving = true;
    block.top = mousePosition.y - tempBlockTop;
    setBlockList([...newBlockList]);
  };

  const changeBlockDate = index => {
    let newBlockList = [...blockList];
    let block = newBlockList[index];
    let day = block.task.date.day();
    let offset = day - currentCol;

    block.task.date = week[currentCol].clone();
    block.task.startTime.add(offset);
    block.task.endTime.add(offset);

    setBlockList([...newBlockList]);
  };

  const handleBlockPickUp = () => {
    console.log('handleBlockPickUp');
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    block.disabled = true;
    setBlockList([...newBlockList]);
  };

  useEffect(() => {
    tableWidth.current = tableElRef.current.getBoundingClientRect().width;
  }, []);

  useEffect(() => {
    let posX = mousePosition.x;
    if (mousePosition.x > tableWidth.current) {
      outArea();
      posX = tableWidth.current;
    }
    setCurrentCol(parseInt(posX / (tableWidth.current / 7)));
    if (isDrawing) {
      activedCol.current = currentCol;
      taskTemp.current.date = week[activedCol.current].clone();
    }
  }, [mousePosition, isDrawing]);

  useEffect(() => {
    if (isDrawing) {
      activedCol.current = currentCol;
    }
    if (activedBlockIndex.current > -1) {
      changeBlockDate(activedBlockIndex.current);
    }
  }, [currentCol, isDrawing]);

  useEffect(() => {
    let startTime = getRelatveTime(
      tempBlockTop,
      tableElRef.current,
      week[activedCol.current],
    );
    taskTemp.current.startTime = startTime;
  }, [tempBlockTop, week]);

  useEffect(() => {
    let endTime = getRelatveTime(
      tempBlockTop + tempBlockHeight,
      tableElRef.current,
      week[activedCol.current],
    );
    taskTemp.current.endTime = endTime;
  }, [tempBlockTop, tempBlockHeight, week]);

  useEffect(() => {
    console.log('blockList', blockList);
  }, [blockList]);

  let ht = 0;
  const hours = Array(24)
    .fill(0)
    .map(() => ht++);

  const tableEl = week.map((date, index) => (
    <GridTableCol key={index}>
      {[
        hours.map((h, idx) => (
          <GridTableCell key={idx} className="grid-table-cell"></GridTableCell>
        )),
        blockList.map(
          (block, idx) =>
            block.task.date.isSame(date) && (
              <TaskBlockSolid
                task={block.task}
                key={idx}
                top={block.top}
                height={block.height}
                disabled={block.disabled}
                actived={block.actived}
                moving={block.moving}
                onActive={activeBlock}
                onDisactive={disactiveBlock}
                onPickUp={handleBlockPickUp}
              ></TaskBlockSolid>
            ),
        ),
        (isDrawing || isMoving || isCreating) &
        (index === activedCol.current) ? (
          <TaskBlock
            task={taskTemp.current}
            key={-1}
            top={tempBlockTop}
            height={tempBlockHeight}
            resizing={isDrawing}
            finishResizing={finishResizing}
            onFinish={finishCreateTask}
            // onPutDown={task => handleBlockPutDown(task)}
            shadow
          />
        ) : null,
      ]}
    </GridTableCol>
  ));

  return (
    <Container
      ref={tableElRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyPress={handleKeyPress}
    >
      {tableEl}
      <div style={{ position: 'fixed', top: 0 }}>
        <p>{`pos: ${mousePosition.x}.${mousePosition.y}`}</p>
        <p>{`col: ${currentCol}`}</p>
        <p>{`tempBlockTop: ${tempBlockTop}`}</p>
        <p>{`tempBlockHeight: ${tempBlockHeight}`}</p>
      </div>
    </Container>
  );
};

function getRelatveTime(y, container, date) {
  if (!date) return;
  const minutes = parseInt(
    24 * 60 * (y / container.getBoundingClientRect().height),
  );
  return date.clone().add(minutes, 'minutes');
}

const Container = styled.div`
  display: flex;
  flex: 1;
`;

const GridTableCol = styled.div`
  position: relative;
  flex: 1;
  &:first-child .grid-table-cell {
    border-left: 1px solid ${props => props.theme.borderColor};
  }
`;

const GridTableCell = styled.div`
  height: 7vw;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  border-right: 1px solid ${props => props.theme.borderColor};
  box-sizing: border-box;
`;

export default CalendarGridTable;
