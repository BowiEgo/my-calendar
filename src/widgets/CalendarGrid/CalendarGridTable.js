import {
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
import { TaskBlock, TaskBlockSolid } from '../index';
import useTaskBlockList from '../TaskBlock/useTaskBlockList';

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

    // ref
    const tableBCR = useRef();
    const hoveredCol = useRef(-1);
    const activedCol = useRef(0);
    const activedBlockId = useRef();
    const tempBlock = useRef({
      top: 0,
      height: 0,
    });
    const tempMousePosition = useRef({ x: 0, y: 0 });
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
      updateBlock(activedBlockId.current, {
        unix: week[activedCol.current],
        top: tempBlock.current.top,
        height: tempBlock.current.height,
        disabled: false,
      });
      // disactiveBlock();
      isMoving.current = false;
    }, [week, updateBlock]);

    // const finishResizing = useCallback(() => {
    //   handleMouseUp();
    // }, [handleMouseUp]);

    const handleBlockPickUp = useCallback(
      id => {
        const block = findBlockById(id);
        if (!block) return;
        tempBlock.current = {
          top: block.top,
          height: block.height,
        };
        isMoving.current = true;
      },
      [findBlockById],
    );

    const handleBlockClick = useCallback(
      (id, element) => {
        openModal(
          getModalOffsetX(
            element,
            tableBCR.current.left + tableBCR.current.width,
          ),
        );
      },
      [openModal],
    );

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
        // return;
      }
      isDrawing.current = true;
      tempBlock.current.top = mousePosition.y;
    }, [mousePosition.y, initTempBlock]);

    const handleMouseMove = useCallback(() => {
      if (isDrawing.current) {
        tempBlock.current.height = mousePosition.y - tempBlock.current.top;
      }

      if (isMoving.current && activedBlock) {
        tempBlock.current.top =
          mousePosition.y - (tempMousePosition.current.y - activedBlock.top);

        activedCol.current = hoveredCol.current;
      }
    }, [activedBlock, mousePosition.y]);

    const handleMouseUp = useCallback(
      e => {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        if (activedBlock || isMoving.current) {
          finishMoving();
          return;
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
      [activedBlock, finishMoving, openModal, createTask],
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
      finishCreateTask();
    }, [taskList, finishCreateTask]);

    const renderTableEl = () => {
      let ht = 0;
      const hours = Array(24)
        .fill(0)
        .map(() => ht++);

      return week.map((unix, index) => {
        return (
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
                  block.unix === unix && (
                    <TaskBlockSolid
                      {...block}
                      key={idx}
                      outerHeight={tableBCR.current.height}
                      onActive={id => {
                        if (!isCreating.current) {
                          tempBlock.current = {
                            top: block.top,
                            height: block.height,
                          };
                          activeBlock(id);
                          activedBlockId.current = id;
                          console.log('activeBlock-9999', block);
                          tempMousePosition.current.y = mousePosition.y;
                          isMoving.current = true;
                        }
                      }}
                      onDisactive={() => {
                        console.log('onDisactive', isMoving.current);
                        // isMoving.current = false;
                        // disactiveBlock();
                      }}
                      onPickUp={handleBlockPickUp}
                      onClick={handleBlockClick}
                    ></TaskBlockSolid>
                  ),
              ),
              (isDrawing.current || isMoving.current || isCreating.current) &
                ((index === activedCol.current) &
                  (tempBlock.current.height > CRITICAL_BLOCK_HEIGHT)) && (
                <TaskBlock
                  ref={tempBlockRef}
                  key={-1}
                  unix={week[activedCol.current]}
                  top={tempBlock.current.top}
                  height={tempBlock.current.height}
                  outerHeight={tableBCR.current.height}
                  moving={isMoving.current}
                  resizing={isDrawing.current}
                  // finishMoving={finishMoving}
                  // finishResizing={finishResizing}
                  onMouseUp={() => {
                    handleMouseUp();
                  }}
                  shadow
                />
              ),
            ]}
          </GridTableCol>
        );
      });
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
