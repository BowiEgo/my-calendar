import produce from 'immer';

const initState = {
  selectedDate: null,
  selectedWeek: [],
  activedCol: -1,
  isTaskEditorOpen: false,
  taskEditorPosition: 0,
  tempTask: {
    title: '无标题',
    unix: 0,
    start: 0,
    end: 0,
    tags: [],
  },
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

    case 'CHANGE_ACTIVED_COL':
      draft.activedCol = payload.col;
      return draft;

    // 任务编辑弹窗
    case 'UPDATE_TASK_EDITOR':
      draft.isTaskEditorOpen = payload.isOpen;
      draft.taskEditorPosition = payload.position || 0;
      return draft;

    case 'UPDATE_TEMP_TASK':
      console.log('UPDATE_TEMP_TASK', payload.tempTask);
      Object.keys(draft.tempTask).forEach(key => {
        if (payload.tempTask.hasOwnProperty(key)) {
          draft.tempTask[key] = payload.tempTask[key];
        }
      });
      return draft;

    case 'ADD_TASK':
      console.log('ADD_TASK', payload);
      draft.taskList.push(payload.task);
      return draft;

    default:
      return draft;
  }
});

export default reducer;
