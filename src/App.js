import "./assets/style/App.css";
import Calendar from "./components/Calendar";
import CalendarList from "./components/CalendarList";
import { ChevronLeft, ChevronRight } from "react-feather";

function App() {
  return (
    <div className="App">
      <header className="App-header">header</header>
      <div className="App-body">
        <div className="App-navbar">
          <div className="App-body-header"></div>

          <div className="local-time">
            <div>GMT+02</div>
            <h1>Nov 2020</h1>
          </div>

          <div className="button-group">
            <button className="button round add-button">
              <svg width="36" height="36" viewBox="0 0 36 36">
                <path fill="#34A853" d="M16 16v14h4V20z"></path>
                <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
                <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
                <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
                <path fill="none" d="M0 0h36v36H0z"></path>
              </svg>
              创建
            </button>
            <button className="button circle prev-button">
              <ChevronLeft color="grey" size={20}></ChevronLeft>
            </button>
            <button className="button circle next-button">
              <ChevronRight color="grey" size={20}></ChevronRight>
            </button>
          </div>

          <div className="calendar card">
            <Calendar></Calendar>
          </div>

          <CalendarList></CalendarList>
          <CalendarList></CalendarList>
        </div>
        <div className="App-content"></div>
        <div className="App-sidebar"></div>
      </div>
    </div>
  );
}

export default App;
