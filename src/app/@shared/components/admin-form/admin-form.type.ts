import { FormLayout } from 'ng-devui';

export interface FormConfig {
  [x: string]: any;
  layout: FormLayout;
  labelSize: 'sm' | '' | 'lg';
  items: any;
}
