import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import { _reqFrame } from '../../utils/reqFrame';
import { TaskBlock, TaskBlockSolid } from '../index';

let bid = 0;
const CRITICAL_BLOCK_HEIGHT = 4;
const MODAL_WIDTH = 180;

const CalendarGridTable = ({ week, mousePosition, offset, onMounted }) => {
  console.log('table-update');

  const [blockList, setBlockList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tempBlockTop, setTempBlockTop] = useState(0);
  const [tempBlockHeight, setTempBlockHeight] = useState(0);
  const [currentCol, setCurrentCol] = useState(-1);

  const tableElRef = useRef();
  const tableBCR = useRef();
  const activedCol = useRef(0);
  const activedBlockIndex = useRef(-1);
  const tempBlockRef = useRef();

  const cursor = useMemo(() => {
    if (isDrawing) return 'ns-resize';
    if (isMoving) return 'move';
  }, [isDrawing, isMoving]);

  const dispatch = useDispatch();

  const openModal = offsetX => {
    dispatch({
      type: 'CHANGE_IS_TASK_EDITOR_OPEN',
      payload: {
        isOpen: true,
        position: offsetX,
      },
    });
  };

  const handleMouseDown = e => {
    if (isCreating) {
      setIsDrawing(false);
      initTempBlock();
      // return;
    }
    setIsDrawing(true);
    setTempBlockTop(mousePosition.y);
  };

  const handleMouseMove = e => {
    if (isDrawing) {
      setTempBlockHeight(mousePosition.y - tempBlockTop);
    }

    if (isMoving) {
      let block = blockList[activedBlockIndex.current];
      setTempBlockTop(mousePosition.y - (block ? block.top : 0));
    }
    if (activedBlockIndex.current > -1) {
      changeBlockTop();
    }
  };

  const handleMouseUp = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      // console.log('handleMouseUp', e);
    }

    if (activedBlockIndex.current > -1 || isMoving) {
      disactiveBlock();
    }
    if (isCreating) {
      setIsCreating(false);
      // return;
    }
    if (tempBlockHeight > CRITICAL_BLOCK_HEIGHT) {
      openModal(getModalOffsetX(tempBlockRef.current));
    }
    createTask();
    setIsDrawing(false);
  };

  const handleMouseLeave = e => {
    setIsDrawing(false);
  };

  const handleKeyPress = e => {
    // console.log(e);
  };

  const createTask = () => {
    setIsCreating(true);
  };

  const finishMoving = () => {
    disactiveBlock({
      date: week[activedCol.current].clone(),
      top: tempBlockTop,
      height: tempBlockHeight,
      disabled: false,
    });
    setIsMoving(false);
  };

  const finishResizing = () => {
    handleMouseUp();
  };

  const finishCreateTask = () => {
    setBlockList([
      ...blockList,
      {
        id: bid++,
        date: week[activedCol.current].clone(),
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

  const activeBlock = id => {
    if (isCreating) return;
    activedBlockIndex.current = blockList.findIndex(block => block.id === id);
    activedCol.current = currentCol;
    setTempBlockTop(mousePosition.y - blockList[activedBlockIndex.current].top);
  };

  const disactiveBlock = params => {
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    if (!block) return;
    block.actived = false;
    if (params) {
      Object.keys(params).forEach(key => {
        block[key] = params[key];
      });
    }
    setBlockList([...newBlockList]);
    activedBlockIndex.current = -1;
  };

  const getModalOffsetX = element => {
    let offsetX = 0;
    if (element) {
      let bcr = element.getBoundingClientRect();
      offsetX = bcr.left + bcr.width + 20;
      if (
        offsetX + MODAL_WIDTH >
        tableBCR.current.left + tableBCR.current.width
      ) {
        offsetX = bcr.left - MODAL_WIDTH - 20;
      }
    }
    return offsetX;
  };

  const handleBlockClick = (id, element) => {
    openModal(getModalOffsetX(element));
  };

  const changeBlockTop = () => {
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    if (!block || block.disabled) return;
    block.actived = true;
    block.top = mousePosition.y - tempBlockTop;
    setBlockList([...newBlockList]);
  };

  const changeBlockDate = useCallback(
    index => {
      let newBlockList = [...blockList];
      let block = newBlockList[index];

      if (!block || block.disabled) return;
      block.date = week[currentCol].clone();

      setBlockList([...newBlockList]);
    },
    [blockList, currentCol, week],
  );

  const handleBlockPickUp = () => {
    let newBlockList = [...blockList];
    let block = newBlockList[activedBlockIndex.current];
    block.disabled = true;
    setBlockList([...newBlockList]);
    setTempBlockTop(block.top);
    setTempBlockHeight(block.height);
    setIsMoving(true);
  };

  useEffect(() => {
    tableBCR.current = tableElRef.current.getBoundingClientRect();
    onMounted(tableBCR.current);
  }, [onMounted]);

  useEffect(() => {
    let posX = mousePosition.x;
    if (mousePosition.x > tableBCR.current.width) {
      outArea();
      posX = tableBCR.current.width;
    }

    let col = parseInt(posX / (tableBCR.current.width / 7));
    col = col === 7 ? 6 : col;
    setCurrentCol(col);

    if (isDrawing) {
      activedCol.current = currentCol;
    }
  }, [mousePosition, isDrawing, currentCol]);

  useEffect(() => {
    if (isDrawing || isMoving) {
      activedCol.current = currentCol;
    }
    if (activedBlockIndex.current > -1) {
      changeBlockDate(activedBlockIndex.current);
    }
  }, [currentCol, isDrawing, isMoving, changeBlockDate]);

  const renderTableEl = () => {
    let ht = 0;
    const hours = Array(24)
      .fill(0)
      .map(() => ht++);

    return week.map((date, index) => (
      <GridTableCol key={index}>
        {[
          hours.map((h, idx) => (
            <GridTableCell
              key={idx}
              className="grid-table-cell"
            ></GridTableCell>
          )),
          blockList.map(
            (block, idx) =>
              block.date.isSame(date) && (
                <TaskBlockSolid
                  {...block}
                  key={idx}
                  outerHeight={tableBCR.current.height}
                  onActive={activeBlock}
                  onDisactive={disactiveBlock}
                  onPickUp={handleBlockPickUp}
                  onClick={handleBlockClick}
                ></TaskBlockSolid>
              ),
          ),
          (isDrawing || isMoving || isCreating) &
          ((index === activedCol.current) &
            (tempBlockHeight > CRITICAL_BLOCK_HEIGHT)) ? (
            <TaskBlock
              ref={tempBlockRef}
              key={-1}
              date={week[activedCol.current].clone()}
              top={tempBlockTop}
              height={tempBlockHeight}
              outerHeight={tableBCR.current.height}
              moving={isMoving}
              resizing={isDrawing}
              finishMoving={finishMoving}
              finishResizing={finishResizing}
              onFinish={finishCreateTask}
              shadow
            />
          ) : null,
        ]}
      </GridTableCol>
    ));
  };

  return (
    <Container
      ref={tableElRef}
      cursor={cursor}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyPress={handleKeyPress}
    >
      {renderTableEl()}
      {/* <div style={{ position: 'fixed', top: 0 }}>
        <p>{`pos: ${mousePosition.x}^${mousePosition.y}`}</p>
        <p>{`col: ${currentCol}`}</p>
        <p>{`tempBlockTop: ${tempBlockTop}`}</p>
        <p>{`tempBlockHeight: ${tempBlockHeight}`}</p>
      </div> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  height: auto;
  cursor: ${props => props.cursor};
`;

const GridTableCol = styled.div`
  position: relative;
  flex: 1;
`;

const GridTableCell = styled.div`
  height: 7vw;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  border-right: 1px solid ${props => props.theme.borderColor};
  box-sizing: border-box;
`;

export default CalendarGridTable;
