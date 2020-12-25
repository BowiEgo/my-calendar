import { withTheme } from 'styled-components';
import Calendar from './Calendar';
import CalendarCell from './CalendarCell';
import CalendarGrid from './CalendarGrid';
import CalendarList from './CalendarList';
import CalendarType from './CalendarType';
import NavBar from './NavBar';

const widgets = [
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
];

widgets.forEach(widget => {
  widget = withTheme(widget);
});

export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
};
