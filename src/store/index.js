const CHANGE_IS_TASK_EDITOR_OPEN = 'CHANGE_IS_TASK_EDITOR_OPEN';
const CHANGE_WEEK_SWITCH_STATUS = 'CHANGE_WEEK_SWITCH_STATUS';

const initState = {
  isTaskEditorOpen: false,
  weekSwitchStatus: 'static',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    // 切换任务编辑弹窗是否显示
    case CHANGE_IS_TASK_EDITOR_OPEN:
      state.isTaskEditorOpen = action.payload.isTaskEditorOpen;
      return state;

    // 切换上下周动画状态
    case CHANGE_WEEK_SWITCH_STATUS:
      state.weekSwitchStatus = action.payload.weekSwitchStatus;
      return state;

    default:
      return state;
  }
};

export default reducer;
