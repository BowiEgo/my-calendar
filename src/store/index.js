import produce from 'immer';

const initState = {
  selectedDate: null,
  selectedWeek: [],
  isTaskEditorOpen: false,
  taskEditorPosition: 0,
  weekSwitchStatus: 'static',
};

const reducer = produce((draft = initState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_SELECTED_DATE':
      draft.selectedDate = payload.date;
      return draft;

    case 'CHANGE_SELECTED_WEEK':
      draft.selectedWeek = payload.week;
      return draft;

    // 切换任务编辑弹窗是否显示
    case 'CHANGE_IS_TASK_EDITOR_OPEN':
      draft.isTaskEditorOpen = payload.isOpen;
      draft.taskEditorPosition = payload.position || 0;
      return draft;

    // 切换上下周动画状态
    case 'CHANGE_WEEK_SWITCH_STATUS':
      draft.weekSwitchStatus = payload.status;
      return draft;

    default:
      return draft;
  }
});

export default reducer;
