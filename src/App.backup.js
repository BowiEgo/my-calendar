import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { main } from './themes';
import {
  motion,
  AnimatePresence,
  animate,
  useAnimation,
  useMotionValue,
} from 'framer-motion';
// import { ChevronLeft, ChevronRight, MessageSquare } from 'react-feather';
import {
  Calendar,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
} from './widgets';

function App() {
  const [currentDate, setCurrentDate] = useState();
  const [week, setWeek] = useState([]);
  const [type, setType] = useState('week');
  const [isVisible, setIsVisible] = useState(false);
  const [gridBCR, setGridBCR] = useState();

  const calendarElRef = useRef();
  const gridScrollTop = useRef();

  const weekSwitchStatus = useSelector(state => state.weekSwitchStatus);
  const dispatch = useDispatch();

  const handleGridMounted = el => {
    setGridBCR(el.getBoundingClientRect());
  };

  const handleGridScroll = top => {
    gridScrollTop.current = top;
  };

  // const control = useAnimation();

  // useEffect(() => {
  //   if (weekSwitchStatus !== 'static') {
  //     if (weekSwitchStatus === 'prev') {
  //       control.set({
  //         opacity: 0,
  //         translateX: -80,
  //       });
  //       control.start({
  //         opacity: 1,
  //         translateX: 0,
  //       });
  //     } else {
  //       control.set({ opacity: 0, translateX: 80 });
  //       control.start({
  //         opacity: 1,
  //         translateX: 0,
  //       });
  //     }
  //     setIsVisible(true);

  //     setTimeout(() => {
  //       dispatch({
  //         type: 'CHANGE_WEEK_SWITCH_STATUS',
  //         payload: {
  //           weekSwitchStatus: 'static',
  //         },
  //       });
  //     }, 300);
  //   } else {
  //     setIsVisible(false);
  //   }
  // }, [weekSwitchStatus]);

  return (
    <ThemeProvider theme={main}>
      <AppBody>
        <AppContent>
          <NavBar></NavBar>
          <CalendarType changeType={setType}></CalendarType>
          {/* <AnimatePresence>
            {gridBCR && isVisible && (
              <motion.div
                initial={{
                  opacity: 1,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  height: gridBCR.height,
                  width: gridBCR.width,
                  position: 'absolute',
                  top: gridBCR.top,
                }}
              >
                <CalendarGrid
                  selectedDate={currentDate}
                  week={week}
                  scrollTop={gridScrollTop.current}
                ></CalendarGrid>
              </motion.div>
            )}
          </AnimatePresence> */}
          <motion.div
            animate={control}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            <CalendarGrid
              selectedDate={currentDate}
              week={week}
              onMounted={handleGridMounted}
              onScroll={handleGridScroll}
            ></CalendarGrid>
          </motion.div>
        </AppContent>
        <CalendarBar>
          {/* <div className="button-group">
            <div className="flex-row">
              <button
                className="button circle prev-button"
                onClick={() => prevWeek()}
              >
                <ChevronLeft color="grey" size={20}></ChevronLeft>
              </button>
              <button
                className="button circle next-button"
                onClick={() => nextWeek()}
              >
                <ChevronRight color="grey" size={20}></ChevronRight>
              </button>
            </div>
          </div> */}
          <UserComp>
            <div className="message">
              {/* <MessageSquare color="grey" size={20}></MessageSquare> */}
            </div>
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
              change={setCurrentDate}
              changeWeek={setWeek}
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
