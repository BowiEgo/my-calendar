import { useMemo, useContext } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import GridContext from './context';
import { TaskBlock, TaskBlockSolid } from '../index';

const Portal = function ({ children, container }, ref) {
  return createPortal(children, container || document.body);
};

const TableEl = ({
  tempBlockContainer,
  week,
  blockList,
  tempBlockRef,
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
}) => {
  // console.log('TableEl-update');

  let ht = 0;
  const hours = Array(24)
    .fill(0)
    .map(() => ht++);

  const gridContext = useContext(GridContext);

  const tempBlockVisible = useMemo(() => {
    return (
      tableBCR !== undefined &&
      (isDrawing || isCreating) &&
      tempBlock.height > criticalBlockHeight
    );
  }, [tableBCR, isDrawing, isCreating, tempBlock, criticalBlockHeight]);

  const tempBlockPos = useMemo(() => {
    const { gridEl, weekEl, labelEl, scrollEl } = gridContext;

    let x =
      tempBlock.left + (labelEl ? labelEl.getBoundingClientRect().width : 0);
    let y =
      tempBlock.top -
      (scrollEl ? scrollEl.scrollTop : 0) +
      (weekEl ? weekEl.getBoundingClientRect().height : 0);

    return {
      x: x,
      y: y,
    };
  }, [tempBlock, gridContext]);

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
          {tempBlockVisible && (
            <TaskBlock
              ref={tempBlockRef}
              key={-1}
              unix={week[activedCol]}
              left={tempBlockPos.x}
              top={tempBlockPos.y}
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
};

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
