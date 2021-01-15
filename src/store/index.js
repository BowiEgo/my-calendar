const CHANGE_WEEK_SWITCH_STATUS = 'CHANGE_WEEK_SWITCH_STATUS';

const initState = {
  weekSwitchStatus: 'static',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGE_WEEK_SWITCH_STATUS':
      state.weekSwitchStatus = action.payload.weekSwitchStatus;
      return state;

    default:
      return state;
  }
};

export default reducer;
