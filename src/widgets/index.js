import { withTheme } from 'styled-components';
import Calendar from './Calendar';
import CalendarCell from './CalendarCell';
import { CalendarGrid, CalendarGridTable } from './CalendarGrid';
import CalendarList from './CalendarList';
import CalendarType from './CalendarType';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import BackForwardSwitch from './BackForwardSwitch';
import { TaskBlock, TaskBlockSolid } from './TaskBlock';
import TypeSwitch from './TypeSwitch';

const widgets = [
  BackForwardSwitch,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridTable,
  CalendarList,
  CalendarType,
  NavBar,
  SearchBar,
  TaskBlock,
  TaskBlockSolid,
  TypeSwitch,
];

widgets.forEach(widget => {
  widget = withTheme(widget);
});

export {
  BackForwardSwitch,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridTable,
  CalendarList,
  CalendarType,
  NavBar,
  SearchBar,
  TaskBlock,
  TaskBlockSolid,
  TypeSwitch,
};
