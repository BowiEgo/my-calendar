import { withTheme } from 'styled-components';
import { Button, ButtonGroup } from './Button';
import Modal from './Modal';
import Switch from './Switch';
import BackForwardSwitch from './BackForwardSwitch';
import CalendarInput from './CalendarInput';
import { Select, Option } from './Select';

const components = [
  Button,
  ButtonGroup,
  Modal,
  Switch,
  BackForwardSwitch,
  CalendarInput,
  Select,
  Option,
];

components.forEach(component => {
  component = withTheme(component);
});

export {
  Button,
  ButtonGroup,
  Modal,
  Switch,
  BackForwardSwitch,
  CalendarInput,
  Select,
  Option,
};
