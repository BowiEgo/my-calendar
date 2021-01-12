import { withTheme } from 'styled-components';
import Calendar from './Calendar';
import CalendarCell from './CalendarCell';
import CalendarGrid from './CalendarGrid';
import CalendarList from './CalendarList';
import CalendarType from './CalendarType';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import BackForthSwitch from './BackForthSwitch';
import { TaskBlock, TaskBlockSolid } from './TaskBlock';
import TypeSwitch from './TypeSwitch';

const widgets = [
  BackForthSwitch,
  Calendar,
  CalendarCell,
  CalendarGrid,
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
  BackForthSwitch,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarList,
  CalendarType,
  NavBar,
  SearchBar,
  TaskBlock,
  TaskBlockSolid,
  TypeSwitch,
};
