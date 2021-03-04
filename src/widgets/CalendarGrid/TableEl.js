import {
  useRef,
  useMemo,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import GridContext from './context';
import { TaskBlock, TaskBlockSolid } from '../index';

const Portal = function ({ children, container }, ref) {
  return createPortal(children, container || document.body);
};

let ht = 0;
const hours = Array(24)
  .fill(0)
  .map(() => ht++);

const TableEl = forwardRef(
  (
    {
      tempBlockContainer,
      week,
      blockList,
      isTempBlockVisible,
      tempBlock,
      tableBCR,
      activedCol,
      isDrawing,
      isMoving,
      isCreating,
      criticalBlockHeight,
      onBlockActive,
      onBlockDisactive,
      onBlockPickUp,
      onBlockClick,
      onBlockResize,
      onMouseUp,
    },
    ref,
  ) => {
    // console.log('TableEl-update');
    const tempBlockRef = useRef();

    const gridContext = useContext(GridContext);
    const { gridEl, weekEl, labelEl, scrollEl } = gridContext;
    const labelWidth = labelEl ? labelEl.getBoundingClientRect().width : 0;
    const weekHeight = weekEl ? weekEl.getBoundingClientRect().height : 0;
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;

    const tempBlockVisible = useMemo(() => {
      return (
        isTempBlockVisible ||
        (tableBCR !== undefined &&
          (isDrawing || isCreating || isMoving) &&
          tempBlock.height > criticalBlockHeight)
      );
    }, [
      isTempBlockVisible,
      tableBCR,
      isDrawing,
      isCreating,
      isMoving,
      tempBlock,
      criticalBlockHeight,
    ]);

    const tempBlockPos = useMemo(() => {
      let x = tempBlock.left + labelWidth;
      let y = tempBlock.top - scrollTop + weekHeight;

      return {
        x: x,
        y: y,
      };
    }, [tempBlock.left, tempBlock.top, labelWidth, weekHeight, scrollTop]);

    useImperativeHandle(ref, () => ({
      getTempTask: () => {
        return tempBlockRef.current.getTask();
      },
      getTempBlockElement: () => {
        return tempBlockRef.current.getElement();
      },
    }));

    return (
      <>
        {[
          week.map((unix, index) => {
            // let tempBlockVisible =
            //   (isDrawing || isMoving || isCreating) &&
            //   tempBlock.height > criticalBlockHeight;

            // tempBlockVisible =
            //   (tempBlockVisible || isTempBlockVisible) && index === activedCol;

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
                          outerHeight={tableBCR.height}
                          onActive={id => onBlockActive(id, block)}
                          onDisactive={() => {
                            onBlockDisactive();
                          }}
                          onPickUp={onBlockPickUp}
                          onClick={onBlockClick}
                          onResize={onBlockResize}
                        ></TaskBlockSolid>
                      ),
                  ),
                ]}
              </GridTableCol>
            );
          }),
          <Portal container={tempBlockContainer} key={'portal'}>
            {tableBCR && (
              <TaskBlock
                show={tempBlockVisible}
                style={{ zIndex: 0 }}
                ref={tempBlockRef}
                key={-1}
                unix={week[activedCol]}
                top={tempBlock.top}
                x={tempBlockPos.x}
                y={tempBlockPos.y}
                width={tableBCR.width / 7}
                height={tempBlock.height}
                outerHeight={tableBCR.height}
                moving={isMoving}
                resizing={isDrawing}
                // finishMoving={finishMoving}
                // finishResizing={finishResizing}
                onMouseUp={() => {
                  onMouseUp();
                }}
                shadow
              />
            )}
          </Portal>,
        ]}
      </>
    );
  },
);

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

export default TableEl;
