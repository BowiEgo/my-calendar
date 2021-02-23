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
import { cloneDeep, update } from 'lodash';
import { _reqFrame } from '../../utils/reqFrame';
import useTaskBlockList from './useTaskBlockList';
import TableEl from './TableEl';

let bid = 0;
const CRITICAL_BLOCK_HEIGHT = 4;
const MODAL_WIDTH = 180;

const getModalOffsetX = (element, boundary) => {
  let offsetX = 0;
  if (element) {
    let bcr = element.getBoundingClientRect();
    offsetX = bcr.left + bcr.width + 20;
    if (offsetX + MODAL_WIDTH > boundary) {
      offsetX = bcr.left - MODAL_WIDTH - 20;
    }
  }
  return offsetX;
};

const CalendarGridTable = forwardRef(
  ({ week, mousePosition, offset, onMounted }, ref) => {
    // console.log('table-update');

    // state
    const [isTempBlockVisible, setIsTempBlockVisible] = useState(false);

    // ref
    const tableBCR = useRef();
    const hoveredCol = useRef(-1);
    const activedCol = useRef(0);
    const tempBlock = useRef({
      top: 0,
      height: 0,
    });
    const mousePositionCache = useRef({ x: 0, y: 0 });
    const isDrawing = useRef(false);
    const isMoving = useRef(false);
    const isCreating = useRef(false);

    const tableElRef = useRef();
    const tempBlockRef = useRef();
    const taskBlockListRef = useRef();

    const cursor = useMemo(() => {
      if (isDrawing.current) return 'ns-resize';
      if (isMoving.current) return 'move';
    }, [isDrawing, isMoving]);

    const dispatch = useDispatch();
    const taskList = useSelector(state => state.taskList);

    const {
      blockList,
      activedBlock,
      activedBlockId,
      findBlockById,
      addBlock,
      updateBlock,
      activeBlock,
      disactiveBlock,
    } = useTaskBlockList();

    const openModal = useCallback(
      offsetX => {
        dispatch({
          type: 'UPDATE_TASK_EDITOR',
          payload: {
            isOpen: true,
            position: offsetX,
          },
        });
      },
      [dispatch],
    );

    const outArea = useCallback(() => {
      isDrawing.current = false;
    }, []);

    const initTempBlock = useCallback(() => {
      tempBlock.current = {
        top: 0,
        height: 0,
      };
    }, []);

    const createTask = useCallback(() => {
      isCreating.current = true;
    }, []);

    const finishMoving = useCallback(() => {
      updateBlock(activedBlockId, {
        unix: week[activedCol.current],
        top: tempBlock.current.top,
        height: tempBlock.current.height,
        disabled: false,
      });
      disactiveBlock();
      isMoving.current = false;
      if (isTempBlockVisible) {
        setIsTempBlockVisible(false);
      }
      initTempBlock();
    }, [
      week,
      isTempBlockVisible,
      activedBlockId,
      updateBlock,
      disactiveBlock,
      initTempBlock,
    ]);

    // const finishResizing = useCallback(() => {
    //   handleMouseUp();
    // }, [handleMouseUp]);

    const handleBlockActive = (id, block) => {
      if (!isCreating.current) {
        tempBlock.current = {
          top: block.top,
          height: block.height,
        };
        mousePositionCache.current.y = mousePosition.y;
        activedCol.current = hoveredCol.current;
        activeBlock(id);
      }
    };

    const handleBlockPickUp = useCallback(
      id => {
        if (isMoving.current) {
          return;
        }
        const block = findBlockById(id);
        updateBlock(id, {
          disabled: true,
        });
        if (block) {
          isMoving.current = true;
          setIsTempBlockVisible(true);
        }
      },
      [findBlockById, updateBlock],
    );

    const handleBlockClick = useCallback((id, element) => {
      console.log('handleBlockClick', id, element);
      // openModal(
      //   getModalOffsetX(
      //     element,
      //     tableBCR.current.left + tableBCR.current.width,
      //   ),
      // );
    }, []);

    const finishCreateTask = useCallback(() => {
      addBlock({
        id: bid++,
        unix: week[activedCol.current],
        top: tempBlock.current.top,
        height: tempBlock.current.height,
        actived: false,
        disabled: false,
        moving: false,
      });
      isCreating.current = false;
      initTempBlock();
    }, [week, addBlock, initTempBlock]);

    const handleMouseDown = useCallback(() => {
      if (isCreating.current) {
        isDrawing.current = false;
        initTempBlock();
      }
      isDrawing.current = true;
      tempBlock.current.top = mousePosition.y;
    }, [mousePosition.y, initTempBlock]);

    const handleMouseMove = useCallback(() => {
      if (isDrawing.current) {
        tempBlock.current.height = mousePosition.y - tempBlock.current.top;
      }

      if (activedBlock) {
        if (!isMoving.current) {
          isMoving.current = true;
        }
        if (!activedBlock.disabled) {
          updateBlock(activedBlock.id, { disabled: true });
        } else {
          tempBlock.current.top =
            mousePosition.y - (mousePositionCache.current.y - activedBlock.top);
          activedCol.current = hoveredCol.current;
        }
      }
    }, [activedBlock, mousePosition.y, updateBlock]);

    const handleMouseUp = useCallback(
      e => {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }

        if (activedBlock) {
          disactiveBlock();
          if (isMoving.current) {
            finishMoving();
            return;
          }
        }

        if (isCreating.current) {
          isCreating.current = false;
        }

        if (tempBlock.current.height > CRITICAL_BLOCK_HEIGHT) {
          openModal(
            getModalOffsetX(
              tempBlockRef.current,
              tableBCR.current.left + tableBCR.current.width,
            ),
          );
        }
        createTask();
        isDrawing.current = false;
      },
      [activedBlock, disactiveBlock, finishMoving, openModal, createTask],
    );

    const handleMouseLeave = useCallback(() => {
      isDrawing.current = false;
    }, []);

    const handleKeyPress = useCallback(e => {
      // console.log(e);
    }, []);

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
      hoveredCol.current = col;

      if (isDrawing.current) {
        activedCol.current = hoveredCol.current;
      }
    }, [mousePosition, outArea]);

    useEffect(() => {
      if (taskList.length === 0) {
        return;
      }
      finishCreateTask();
    }, [taskList, finishCreateTask]);

    const tableElProps = {
      week,
      blockList,
      tempBlockRef,
      isTempBlockVisible,
      tempBlock: tempBlock.current,
      tableBCR: tableBCR.current,
      activedCol: activedCol.current,
      isDrawing: isDrawing.current,
      isMoving: isMoving.current,
      isCreating: isCreating.current,
      onBlockActive: handleBlockActive,
      onBlockDisactive: disactiveBlock,
      onBlockPickUp: handleBlockPickUp,
      onBlockClick: handleBlockClick,
      onMouseUp: handleMouseUp,
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
        <TableEl {...tableElProps}></TableEl>
        {/* <div style={{ position: 'fixed', top: 0 }}>
        <p>{`pos: ${mousePosition.x}^${mousePosition.y}`}</p>
        <p>{`col: ${hoveredCol}`}</p>
        <p>{`tempBlockTop: ${tempBlockTop}`}</p>
        <p>{`tempBlockHeight: ${tempBlockHeight}`}</p>
      </div> */}
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  flex: 1;
  height: auto;
  cursor: ${props => props.cursor};
`;

export default CalendarGridTable;
