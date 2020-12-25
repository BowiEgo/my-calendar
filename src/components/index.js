import { withTheme } from 'styled-components';
import Button from './Button';
import ButtonGroup from './ButtonGroup';

const components = [Button, ButtonGroup];

components.forEach(component => {
  component = withTheme(component);
});

export { Button, ButtonGroup };
