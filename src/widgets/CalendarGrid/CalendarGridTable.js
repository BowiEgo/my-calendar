import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import moment from 'moment';
import { cloneDeep, update } from 'lodash';
import { _reqFrame } from '../../utils/reqFrame';
import GridContext from './context';
import useTaskBlockList from './useTaskBlockList';
import TableEl from './TableEl';

let bid = 0;
const CRITICAL_BLOCK_HEIGHT = 4;
const MODAL_WIDTH = 220;

const TIME_GAP = 15 * 60 * 1000;
const TIME_NUM = (24 * 60 * 60 * 1000) / TIME_GAP;

const getModalPos = (element, boundary, offset) => {
  let x = 0;
  if (element) {
    let bcr = element.getBoundingClientRect();
    x = bcr.left + bcr.width + 20;
    if (x + MODAL_WIDTH > boundary) {
      x = bcr.left - MODAL_WIDTH - 20;
    }
  }
  return x;
};

const roundPosY = (y, outerY, num) => {
  let multi = Math.ceil(y / (outerY / num));

  return (outerY / num) * (multi - 1);
};

const CalendarGridTable = (
  { tempBlockContainer, week, mousePosition, onMounted },
  ref,
) => {
  // console.log('table-update');

  // state
  const [isTempBlockVisible, setIsTempBlockVisible] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activedCol, setActivedCol] = useState(-1);
  const [{ tempBlock }, updateState] = useImmer({
    tempBlock: { top: 0, left: 0, height: 0 },
  });

  // ref
  const tableBCR = useRef();
  const hoveredCol = useRef(-1);

  const mousePositionCache = useRef({ x: 0, y: 0 });
  const tableContainerRef = useRef();
  const tableRef = useRef();
  const tempBlockRef = useRef();
  const taskBlockListRef = useRef();

  const cursor = useMemo(() => {
    if (isDrawing || isResizing) return 'ns-resize';
    if (isMoving) return 'move';
  }, [isDrawing, isResizing, isMoving]);

  const dispatch = useDispatch();
  const tempTask = useSelector(state => state.tempTask);
  const taskList = useSelector(state => state.taskList);
  const activedColStore = useSelector(state => state.activedCol);
  const isTaskEditorOpen = useSelector(state => state.isTaskEditorOpen);

  const { gridEl, labelEl } = useContext(GridContext);

  const gridLeft = useMemo(() => {
    return gridEl ? gridEl.getBoundingClientRect().left : 0;
  }, [gridEl]);
  const labelWidth = useMemo(() => {
    return labelEl ? labelEl.getBoundingClientRect().width : 0;
  }, [labelEl]);

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
  }, [dispatch]);

  const outArea = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const initTempBlock = useCallback(() => {
    updateState(draft => {
      draft.tempBlock = {
        top: 0,
        left: 0,
        height: 0,
      };
    });
  }, []);

  const finishMoving = useCallback(() => {
    updateBlock(activedBlockId, {
      unix: week[activedCol],
      top: tempBlock.top,
      height: tempBlock.height,
      disabled: false,
    });
    if (isTempBlockVisible) {
      setIsTempBlockVisible(false);
    }
    initTempBlock();
  }, [
    week,
    activedCol,
    tempBlock,
    isTempBlockVisible,
    activedBlockId,
    updateBlock,
    initTempBlock,
  ]);

  // const finishResizing = useCallback(() => {
  //   handleMouseUp();
  // }, [handleMouseUp]);

  const handleBlockActive = useCallback(
    (id, block) => {
      if (!isCreating) {
        updateState(draft => {
          draft.tempBlock = {
            top: block.top,
            height: block.height,
            left: (tableBCR.current.width / 7) * hoveredCol.current,
          };
        });

        mousePositionCache.current.y = mousePosition.y;
        setActivedCol(hoveredCol.current);
      }
      activeBlock(id);
      setIsCreating(false);
      closeModal();
    },
    [isCreating, mousePosition.y, activeBlock, closeModal],
  );

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
    //   getModalPos(
    //     element,
    //     tableBCR.current.left + tableBCR.current.width,
    //   ),
    // );
  }, []);

  const handleBlockResize = useCallback(id => {
    setIsResizing(true);
  }, []);

  const finishCreateTask = useCallback(() => {
    if (isCreating) {
      addBlock({
        id: bid++,
        unix: week[activedCol],
        top: tempBlock.top,
        height: tempBlock.height,
        actived: false,
        disabled: false,
        moving: false,
      });
      setIsCreating(false);
      initTempBlock();
    }
  }, [week, isCreating, activedCol, tempBlock, addBlock, initTempBlock]);

  const handleMouseDown = useCallback(
    e => {
      initTempBlock();

      if (isCreating) {
        setIsDrawing(false);
        setIsCreating(false);
      }
      if (!isResizing) {
        setIsDrawing(true);
      }

      updateState(draft => {
        draft.tempBlock.top = roundPosY(
          mousePosition.y,
          tableBCR.current.height,
          TIME_NUM,
        );
        draft.tempBlock.left =
          (tableBCR.current.width / 7) * hoveredCol.current;
      });
    },
    [isResizing, isCreating, mousePosition.y, initTempBlock],
  );

  const handleMouseMove = useCallback(() => {
    if (isDrawing) {
      updateState(draft => {
        draft.tempBlock.height = roundPosY(
          mousePosition.y - draft.tempBlock.top,
          tableBCR.current.height,
          TIME_NUM,
        );
      });
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
          updateState(draft => {
            draft.tempBlock.top =
              mousePosition.y -
              (mousePositionCache.current.y - activedBlock.top);
            draft.tempBlock.left =
              (tableBCR.current.width / 7) * hoveredCol.current;
          });
          // tempBlock.current.top =
          //   mousePosition.y - (mousePositionCache.current.y - activedBlock.top);
          // tempBlock.current.left =
          //   (tableBCR.current.width / 7) * hoveredCol.current;
          setActivedCol(hoveredCol.current);
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

      if (tempBlock.height > CRITICAL_BLOCK_HEIGHT) {
        let tempTask = tableRef.current.getTempTask();
        dispatch({
          type: 'UPDATE_TEMP_TASK',
          payload: {
            tempTask: tempTask,
          },
        });

        openModal(
          getModalPos(
            tableRef.current.getTempBlockElement(),
            tableBCR.current.left + tableBCR.current.width,
            gridLeft + labelWidth,
          ),
        );

        setIsCreating(true);

        dispatch({
          type: 'CHANGE_SELECTED_DATE',
          payload: {
            date: week[activedCol],
          },
        });
      }
      setIsDrawing(false);
    },
    [
      week,
      activedCol,
      tempBlock,
      activedBlock,
      isCreating,
      gridLeft,
      labelWidth,
      handleBlockDisactive,
      openModal,
      dispatch,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleKeyPress = useCallback(e => {
    // console.log(e);
  }, []);

  useEffect(() => {
    tableBCR.current = tableContainerRef.current.getBoundingClientRect();
    onMounted(tableBCR.current);
  }, [onMounted]);

  useEffect(() => {
    updateState(draft => {
      draft.tempBlock.left = (tableBCR.current.width / 7) * activedCol;
    });

    if (isTaskEditorOpen) {
      openModal(
        getModalPos(
          tableRef.current.getTempBlockElement(),
          tableBCR.current.left + tableBCR.current.width,
          gridLeft + labelWidth,
        ),
      );
    }
  }, [week, activedCol, isTaskEditorOpen, gridLeft, labelWidth, openModal]);

  useEffect(() => {
    updateState(draft => {
      draft.tempBlock.left = (tableBCR.current.width / 7) * activedColStore;
    });
    setActivedCol(activedColStore);
  }, [activedColStore]);

  useEffect(() => {
    let posX = mousePosition.x;
    if (mousePosition.x > tableBCR.current.width) {
      outArea();
      posX = tableBCR.current.width;
    }

    let col = parseInt(posX / (tableBCR.current.width / 7));
    col = col === 7 ? 6 : col;
    hoveredCol.current = col;

    if (isDrawing && tempBlock.height > CRITICAL_BLOCK_HEIGHT) {
      setActivedCol(hoveredCol.current);
    }
  }, [isDrawing, tempBlock, mousePosition, outArea]);

  useEffect(() => {
    if (!isTaskEditorOpen) {
      finishCreateTask();
    }
  }, [isTaskEditorOpen, finishCreateTask]);

  useEffect(() => {
    console.log(
      'tempTask-w',
      getRelatveY(tempTask.start, tableBCR.current.height),
    );
    updateState(draft => {
      draft.tempBlock.top = getRelatveY(
        tempTask.start,
        tableBCR.current.height,
      );
    });
  }, [tempTask]);

  const tableElProps = {
    tempBlockContainer,
    week,
    blockList,
    tempBlockRef,
    isTempBlockVisible,
    tempBlock: tempBlock,
    tableBCR: tableBCR.current,
    activedCol: activedCol,
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
      ref={tableContainerRef}
      cursor={cursor}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyPress={handleKeyPress}
    >
      <TableEl {...tableElProps} ref={tableRef}></TableEl>
      <div style={{ position: 'fixed', top: 0 }}>
        {/* <p>{`pos: ${mousePosition.x}^${mousePosition.y}`}</p>
        <p>{`col: ${hoveredCol.current}`}</p>
        <p>{`activedCol: ${activedCol}`}</p> */}
        {/* <p>{`tempBlockTop: ${tempBlockTop}`}</p>
          <p>{`tempBlockHeight: ${tempBlockHeight}`}</p> */}
      </div>
    </Container>
  );
};

function getRelatveY(unix, outerHeight) {
  let start = moment(unix).startOf('day');
  console.log('getRelatveY', start, outerHeight);
  return outerHeight * ((unix - start) / (24 * 60 * 60 * 1000));
}

const Container = styled.div`
  display: flex;
  flex: 1;
  height: auto;
  cursor: ${props => props.cursor};
`;

export default CalendarGridTable;
