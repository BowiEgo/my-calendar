import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
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
    const [isDrawing, setIsDrawing] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // ref
    const tableBCR = useRef();
    const hoveredCol = useRef(-1);
    const activedCol = useRef(0);
    const tempBlock = useRef({
      top: 0,
      height: 0,
    });
    const mousePositionCache = useRef({ x: 0, y: 0 });
    const tableElRef = useRef();
    const tempBlockRef = useRef();
    const taskBlockListRef = useRef();

    const cursor = useMemo(() => {
      if (isDrawing || isResizing) return 'ns-resize';
      if (isMoving) return 'move';
    }, [isDrawing, isResizing, isMoving]);

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

    const closeModal = useCallback(() => {
      dispatch({
        type: 'UPDATE_TASK_EDITOR',
        payload: {
          isOpen: false,
          position: null,
        },
      });
    }, []);

    const outArea = useCallback(() => {
      setIsDrawing(false);
    }, []);

    const initTempBlock = useCallback(() => {
      tempBlock.current = {
        top: 0,
        height: 0,
      };
    }, []);

    const finishMoving = useCallback(() => {
      updateBlock(activedBlockId, {
        unix: week[activedCol.current],
        top: tempBlock.current.top,
        height: tempBlock.current.height,
        disabled: false,
      });
      if (isTempBlockVisible) {
        setIsTempBlockVisible(false);
      }
      initTempBlock();
    }, [week, isTempBlockVisible, activedBlockId, updateBlock, initTempBlock]);

    // const finishResizing = useCallback(() => {
    //   handleMouseUp();
    // }, [handleMouseUp]);

    const handleBlockActive = (id, block) => {
      if (!isCreating) {
        tempBlock.current = {
          top: block.top,
          height: block.height,
        };
        mousePositionCache.current.y = mousePosition.y;
        activedCol.current = hoveredCol.current;
      }
      activeBlock(id);
      setIsCreating(false);
      closeModal();
    };

    const handleBlockDisactive = useCallback(() => {
      if (isMoving) {
        finishMoving();
      }
      disactiveBlock();
      setIsResizing(false);
      setIsMoving(false);
    }, [isMoving, finishMoving, disactiveBlock]);

    const handleBlockPickUp = useCallback(
      id => {
        if (isMoving) {
          return;
        }
        const block = findBlockById(id);
        updateBlock(id, {
          disabled: true,
        });
        if (block) {
          setIsMoving(true);
          setIsTempBlockVisible(true);
        }
      },
      [isMoving, findBlockById, updateBlock],
    );

    const handleBlockClick = useCallback((id, element) => {
      // console.log('handleBlockClick', id, element);
      // openModal(
      //   getModalOffsetX(
      //     element,
      //     tableBCR.current.left + tableBCR.current.width,
      //   ),
      // );
    }, []);

    const handleBlockResize = useCallback(id => {
      setIsResizing(true);
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
      setIsCreating(false);
      initTempBlock();
    }, [week, addBlock, initTempBlock]);

    const handleMouseDown = useCallback(
      e => {
        initTempBlock();

        if (isCreating) {
          setIsDrawing(false);
        }
        if (!isResizing) {
          setIsDrawing(true);
        }
        tempBlock.current.top = mousePosition.y;
      },
      [isResizing, isCreating, mousePosition.y, initTempBlock],
    );

    const handleMouseMove = useCallback(() => {
      if (isDrawing) {
        tempBlock.current.height = mousePosition.y - tempBlock.current.top;
      }

      if (activedBlock) {
        if (isResizing) {
          updateBlock(activedBlock.id, {
            height: mousePosition.y - activedBlock.top,
          });
        } else {
          if (!isMoving) {
            setIsMoving(true);
          }

          if (!activedBlock.disabled) {
            updateBlock(activedBlock.id, { disabled: true });
          } else {
            tempBlock.current.top =
              mousePosition.y -
              (mousePositionCache.current.y - activedBlock.top);
            activedCol.current = hoveredCol.current;
          }
        }
      }
    }, [
      isDrawing,
      isResizing,
      isMoving,
      activedBlock,
      mousePosition.y,
      updateBlock,
    ]);

    const handleMouseUp = useCallback(
      e => {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }

        if (activedBlock) {
          handleBlockDisactive();
          return;
        }

        if (isCreating) {
          setIsCreating(false);
        }

        if (tempBlock.current.height > CRITICAL_BLOCK_HEIGHT) {
          openModal(
            getModalOffsetX(
              tempBlockRef.current,
              tableBCR.current.left + tableBCR.current.width,
            ),
          );
          setIsCreating(true);
        }
        setIsDrawing(false);
      },
      [activedBlock, isCreating, handleBlockDisactive, openModal],
    );

    const handleMouseLeave = useCallback(() => {
      setIsDrawing(false);
    }, []);

    const handleKeyPress = useCallback(e => {
      // console.log(e);
    }, []);

    useImperativeHandle(ref, () => ({
      changeTempBlockDate: unix => {
        console.log('changeTempBlockDate', unix);
        tempBlock.current.unix = unix;
      },
    }));

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

      if (isDrawing) {
        activedCol.current = hoveredCol.current;
      }
    }, [isDrawing, mousePosition, outArea]);

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
      isDrawing: isDrawing,
      isMoving: isMoving,
      isCreating: isCreating,
      criticalBlockHeight: CRITICAL_BLOCK_HEIGHT,
      onBlockActive: handleBlockActive,
      onBlockDisactive: handleBlockDisactive,
      onBlockPickUp: handleBlockPickUp,
      onBlockClick: handleBlockClick,
      onBlockResize: handleBlockResize,
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
