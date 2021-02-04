import { withTheme } from 'styled-components';
import { Button, ButtonGroup } from './Button';
import Modal from './Modal';
import Switch from './Switch';
import BackForwardSwitch from './BackForwardSwitch';

const components = [Button, ButtonGroup, Modal, Switch, BackForwardSwitch];

components.forEach(component => {
  component = withTheme(component);
});

export { Button, ButtonGroup, Modal, Switch, BackForwardSwitch };
