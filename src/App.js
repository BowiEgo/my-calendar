import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { main } from './themes';
// import { ChevronLeft, ChevronRight, MessageSquare } from 'react-feather';
import {
  Calendar,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
} from './widgets';

function App() {
  console.log('app-update');
  const [type, setType] = useState('week');
  const [isVisible, setIsVisible] = useState(false);

  const rootElRef = useRef();
  const calendarElRef = useRef();

  const selectedDate = useSelector(state => state.selectedDate);
  const selectedWeek = useSelector(state => state.selectedWeek);

  console.warn('app-update-1', selectedDate, selectedWeek);

  useState(() => {
    console.log('before-mounted');
  });

  useEffect(() => {
    console.log(rootElRef.current);
  }, []);

  function changeSelectedDate(unix) {
    console.log('changeSelectedDate', unix);
  }

  function changeWeek(week) {
    console.log('changeWeek', week);
  }

  return (
    <ThemeProvider theme={main}>
      <AppBody ref={rootElRef}>
        <AppContent>
          <NavBar></NavBar>
          <CalendarType changeType={setType}></CalendarType>
          <CalendarGrid
            selectedDate={selectedDate}
            week={selectedWeek}
            rootContainer={rootElRef.current}
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
              change={changeSelectedDate}
              changeWeek={changeWeek}
            ></Calendar>

            <Notification></Notification>

            <CalendarList></CalendarList>
          </ScrollContainer>
        </CalendarBar>
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
