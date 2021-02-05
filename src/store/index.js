import produce from 'immer';

const initState = {
  selectedDate: null,
  selectedWeek: [],
  isTaskEditorOpen: false,
  taskEditorPosition: 0,
  taskList: [],
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

    // 任务编辑弹窗
    case 'UPDATE_TASK_EDITOR':
      draft.isTaskEditorOpen = payload.isOpen;
      draft.taskEditorPosition = payload.position || 0;
      return draft;

    case 'ADD_TASK':
      draft.taskList.push(payload.task);
      return draft;

    default:
      return draft;
  }
});

export default reducer;
