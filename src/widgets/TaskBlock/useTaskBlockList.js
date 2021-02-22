import { useRef, useMemo, useCallback } from 'react';
import { useImmer } from 'use-immer';

export default function useTaskBlockList() {
  const [{ blockList }, updateState] = useImmer({
    blockList: [],
  });

  const activedBlockMemo = useMemo(() => {
    return blockList[blockList.findIndex(item => item.actived)];
  }, [blockList]);

  const findBlockById = useCallback(
    id => {
      return blockList[blockList.findIndex(item => item.id === id)];
    },
    [blockList],
  );

  const addBlock = useCallback(
    block => {
      console.log('addBlock', block);
      updateState(draft => {
        draft.blockList.push(block);
      });
    },
    [updateState],
  );

  const updateBlock = useCallback(
    (id, properties) => {
      console.log('updateBlock', id, properties);
      updateState(draft => {
        let block = draft.blockList.find(item => item.id === id);
        if (block) {
          Object.keys(properties).forEach(key => {
            block[key] = properties[key];
          });
        }
      });
    },
    [updateState],
  );

  const activeBlock = useCallback(
    id => {
      updateState(draft => {
        let blockIndex = draft.blockList.findIndex(item => item.id === id);
        let activedBlockIndex = draft.blockList.findIndex(item => item.actived);
        let block = draft.blockList[blockIndex];
        let activedBlock = draft.blockList[activedBlockIndex];

        if (block) {
          if (activedBlock) {
            activedBlock.actived = false;
          }
          block.actived = true;
        }
      });
    },
    [updateState],
  );

  const disactiveBlock = useCallback(
    id => {
      updateState(draft => {
        let blockIndex = draft.blockList.findIndex(item => item.id === id);
        let activedBlockIndex = draft.blockList.findIndex(item => item.actived);
        let block = draft.blockList[blockIndex];
        let activedBlock = draft.blockList[activedBlockIndex];

        if (id) {
          if (block) {
            block.actived = false;
          }
        } else {
          if (activedBlock) {
            activedBlock.actived = false;
          }
        }
      });
    },
    [updateState],
  );

  return {
    blockList,
    activedBlock: activedBlockMemo,
    findBlockById,
    addBlock,
    updateBlock,
    activeBlock,
    disactiveBlock,
  };
}
