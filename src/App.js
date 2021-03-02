import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useImmer } from 'use-immer';
import styled, { ThemeProvider } from 'styled-components';
import { main } from './themes';
import { Modal } from './components';
import {
  Calendar,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
  TaskEditor,
} from './widgets';

function App() {
  console.log('app-update');
  // state
  const [{ weekList }, updateState] = useImmer({
    weekList: [],
  });

  const rootElRef = useRef();
  const calendarElRef = useRef();
  const calendarGridRef = useRef();

  // store
  const selectedDate = useSelector(state => state.selectedDate);
  const selectedWeek = useSelector(state => state.selectedWeek);
  const isTaskEditorOpen = useSelector(state => state.isTaskEditorOpen);
  const taskEditorPosition = useSelector(state => state.taskEditorPosition);
  const dispatch = useDispatch();

  useState(() => {
    console.log('before-mounted');
  });

  useEffect(() => {
    console.log(rootElRef.current);
  }, []);

  // method
  function changeSelectedDate(unix) {
    dispatch({
      type: 'CHANGE_SELECTED_DATE',
      payload: {
        date: unix,
      },
    });
  }

  function changeGridType(type) {
    console.log('changeGridType', type);
  }

  function changeToPrev() {
    calendarElRef.current && calendarElRef.current.prevWeek();
  }

  function changeToNext() {
    calendarElRef.current && calendarElRef.current.nextWeek();
  }

  const updateWeekList = week => {
    updateState(draft => {
      draft.weekList = week;
    });
  };

  const toggleModal = (isOpen = false) => {
    dispatch({
      type: 'UPDATE_TASK_EDITOR',
      payload: {
        isOpen: isOpen,
      },
    });
  };

  const createTask = () => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        task: {},
      },
    });
    toggleModal(false);
  };

  const handleEditorDateChange = unix => {
    calendarGridRef.current.changeTaskDate(unix);
  };

  return (
    <ThemeProvider theme={main}>
      <AppBody ref={rootElRef}>
        <AppContent>
          <NavBar></NavBar>
          <CalendarType
            onChange={changeGridType}
            onPrev={changeToPrev}
            onNext={changeToNext}
          ></CalendarType>
          <CalendarGrid
            ref={calendarGridRef}
            selectedDate={selectedDate}
            week={weekList}
          ></CalendarGrid>
        </AppContent>

        <CalendarBar>
          <UserComp>
            <UserPic>
              <img
                alt="avatar"
                src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
              ></img>
            </UserPic>
          </UserComp>

          <ScrollContainer>
            <Calendar
              ref={calendarElRef}
              onChange={changeSelectedDate}
              onChangeWeek={updateWeekList}
            ></Calendar>
            <Notification></Notification>
            <CalendarList></CalendarList>
          </ScrollContainer>
        </CalendarBar>

        <Modal
          left={taskEditorPosition}
          isOpen={isTaskEditorOpen}
          container={rootElRef.current}
          onClickOutside={() => toggleModal(false)}
        >
          <TaskEditor
            onDateChange={handleEditorDateChange}
            onClickCreate={createTask}
          ></TaskEditor>
        </Modal>
      </AppBody>
    </ThemeProvider>
  );
}

const AppBody = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 72px - 88px);
`;

const AppContent = styled.div`
  flex: 1;
  height: 100%;
  padding: 0 40px;
  background-color: transparent;
  z-index: 2;
`;

const CalendarBar = styled.div`
  width: 320px;
  height: 100vh;
  padding: 0 20px 0 40px;
  display: flex;
  flex-direction: column;
  background-color: #f8f7fd;
  z-index: 0;
`;

const UserComp = styled.div`
  position: relative;
  padding: 14px 20px 14px 0;
  display: flex;
  justify-content: space-between;
  background-color: inherit;
  &::after {
    content: '';
    display: block;
    width: 240px;
    height: 1px;
    background-color: #e8e3f7;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

const UserPic = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: white;
  }
`;

const ScrollContainer = styled.div`
  overflow-y: scroll;
  padding-right: 10px;
  margin-top: 20px;
  margin-left: -10px;
  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
  .local-time {
    text-align: left;
    height: 120px;
    line-height: 14px;
    box-sizing: border-box;
    padding: 20px 20px 40px 20px;
    z-index: 1;
    div {
      color: #9e9e9e;
    }
  }
`;

const Notification = styled.div`
  width: 100%;
  height: 140px;
  margin-top: 30px;
  border-radius: 14px;
  background-color: #e8e3f7;
`;

export default App;
