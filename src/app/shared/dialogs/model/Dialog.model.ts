import { ComponentsName } from '../dialogs-components-service';

export interface Dialog {
  id: any;
  data?: any;
  isOpen?: boolean;
  dataClose?: any;
  component: ComponentsName | string;
  config: 'REGULAR' | 'FULL_DIALOG' | 'ONLY_DIALOG' | 'ONLY_BOTTOM_SHEETS';
}
