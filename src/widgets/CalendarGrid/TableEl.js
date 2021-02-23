import styled from 'styled-components';
import { TaskBlock, TaskBlockSolid } from '../index';

const CRITICAL_BLOCK_HEIGHT = 4;

const TableEl = ({
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
  onBlockActive,
  onBlockDisactive,
  onBlockPickUp,
  onBlockClick,
  onMouseUp,
}) => {
  // console.log('TableEl-update');

  let ht = 0;
  const hours = Array(24)
    .fill(0)
    .map(() => ht++);

  return (
    <>
      {[
        week.map((unix, index) => {
          let tempBlockVisible =
            (isDrawing || isMoving || isCreating) &&
            tempBlock.height > CRITICAL_BLOCK_HEIGHT;

          tempBlockVisible =
            (tempBlockVisible || isTempBlockVisible) && index === activedCol;

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
                      ></TaskBlockSolid>
                    ),
                ),
                tempBlockVisible && (
                  <TaskBlock
                    ref={tempBlockRef}
                    key={-1}
                    unix={week[activedCol]}
                    top={tempBlock.top}
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
                ),
              ]}
            </GridTableCol>
          );
        }),
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
