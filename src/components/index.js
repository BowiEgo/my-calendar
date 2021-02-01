import { withTheme } from 'styled-components';
import { Button, ButtonGroup } from './Button';
import Modal from './Modal';

const components = [Button, ButtonGroup, Modal];

components.forEach(component => {
  component = withTheme(component);
});

export { Button, ButtonGroup, Modal };
