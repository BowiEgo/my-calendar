import { withTheme } from 'styled-components';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Switch from './Switch';

const components = [Button, ButtonGroup, Switch];

components.forEach(component => {
  component = withTheme(component);
});

export { Button, ButtonGroup, Switch };
