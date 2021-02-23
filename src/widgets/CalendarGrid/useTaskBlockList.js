import { useRef, useMemo, useCallback } from 'react';
import { useImmer } from 'use-immer';

export default function useTaskBlockList() {
  const [{ blockList }, updateState] = useImmer({
    blockList: [],
  });

  const activedBlockId = useRef();

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
      updateState(draft => {
        draft.blockList.push(block);
      });
    },
    [updateState],
  );

  const updateBlock = useCallback(
    (id, properties) => {
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
        let block = draft.blockList.find(item => item.id === id);
        let activedBlock = draft.blockList.find(item => item.actived === true);

        if (block) {
          block.actived = true;
          activedBlockId.current = id;
          if (activedBlock) {
            activedBlock.actived = false;
          }
        }
      });
    },
    [updateState],
  );

  const disactiveBlock = useCallback(
    id => {
      updateState(draft => {
        let block = draft.blockList.find(item => item.id === id);
        let activedBlock = draft.blockList.find(item => item.actived === true);

        if (id) {
          if (block) {
            block.actived = false;
            activedBlockId.current = null;
          }
        } else {
          if (activedBlock) {
            activedBlock.actived = false;
            activedBlockId.current = null;
          }
        }
      });
    },
    [updateState],
  );

  return {
    blockList,
    activedBlock: activedBlockMemo,
    activedBlockId: activedBlockId.current,
    findBlockById,
    addBlock,
    updateBlock,
    activeBlock,
    disactiveBlock,
  };
}
