import { useCallback, forwardRef, useImperativeHandle, Fragment } from 'react';
import useTaskBlockList from './useTaskBlockList';
import { TaskBlockSolid } from '../index';

const TaskBlockList = forwardRef(({ children, onBlockPickUp } = {}, ref) => {
  const {
    blockList,
    activedBlock,
    updateBlock,
    activeBlock,
    disactiveBlock,
  } = useTaskBlockList();

  const handleBlockPickUp = useCallback(() => {
    onBlockPickUp && onBlockPickUp();

    updateBlock(activedBlock.id, 'disabled', true);
  }, [blockList, updateBlock]);

  useImperativeHandle(ref, () => ({
    updateBlock: updateBlock,
    activeBlock: activeBlock,
    disactiveBlock: disactiveBlock,
  }));

  return (
    <div ref={ref}>
      {blockList.map(
        (block, idx) =>
          block.unix === unix && (
            <TaskBlockSolid
              {...block}
              key={idx}
              outerHeight={tableBCR.current.height}
              onActive={() => (isCreating.current ? {} : activeBlock())}
              onDisactive={disactiveBlock}
              onPickUp={handleBlockPickUp}
              onClick={handleBlockClick}
            ></TaskBlockSolid>
          ),
      )}
    </div>
  );
});

export default TaskBlockList;
