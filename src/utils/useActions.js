import { useSelector, useDispatch } from 'react-redux';

export default () => {
  const storeState = useSelector(state => {
    return state;
  });
  console.log('storeState', storeState);
  // const isTaskEditorOpen = useSelector(state => state.isTaskEditorOpen);
  // const weekSwitchStatus = useSelector(state => state.weekSwitchStatus);

  const dispatch = useDispatch();

  const openModal = () => {
    dispatch({
      type: 'CHANGE_IS_TASK_EDITOR_OPEN',
      payload: {
        isTaskEditorOpen: true,
      },
    });
  };

  const closeModal = () => {
    dispatch({
      type: 'CHANGE_IS_TASK_EDITOR_OPEN',
      payload: {
        isTaskEditorOpen: false,
      },
    });
  };

  const changeWeekSwitchStatus = status => {
    dispatch({
      type: 'CHANGE_WEEK_SWITCH_STATUS',
      payload: {
        weekSwitchStatus: status,
      },
    });
  };

  return {
    storeState,
    openModal,
    closeModal,
    changeWeekSwitchStatus,
  };
};
