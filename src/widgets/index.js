import { withTheme } from 'styled-components';
import { Calendar, CalendarCell } from './Calendar';
import { CalendarType } from './CalendarType';
import {
  CalendarGrid,
  CalendarGridTable,
  CalendarGridPointer,
} from './CalendarGrid';
import CalendarList from './CalendarList';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import { TaskBlock, TaskBlockSolid } from './TaskBlock';
import TaskEditor from './TaskEditor';

const widgets = [
  CalendarType,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridTable,
  CalendarGridPointer,
  CalendarList,
  NavBar,
  SearchBar,
  TaskBlock,
  TaskBlockSolid,
  TaskEditor,
];

widgets.forEach(widget => {
  widget = withTheme(widget);
});

export {
  Calendar,
  CalendarType,
  CalendarCell,
  CalendarGrid,
  CalendarGridTable,
  CalendarGridPointer,
  CalendarList,
  NavBar,
  SearchBar,
  TaskBlock,
  TaskBlockSolid,
  TaskEditor,
};
