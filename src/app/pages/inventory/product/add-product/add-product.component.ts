import { Component } from '@angular/core';
import { FormLayout, MenuConfig } from 'ng-devui';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  columnsLayout: FormLayout = FormLayout.Columns;
  addedLabelList = [];
  labelList = [
    {
      id: 1,
      label: 'OpenSource',
    },
    {
      id: 2,
      label: 'DevOps',
    },
    {
      id: 3,
      label: 'SoftWare',
    },
  ];
  selectOptions = [
    {
      id: 1,
      label: 'Team1',
    },
    {
      id: 2,
      label: 'Team2',
    },
    {
      id: 3,
      label: 'Team3',
    },
  ];
  selectOptions2 = [
    {
      id: 1,
      label: 'Leader',
    },
    {
      id: 2,
      label: 'Developer',
    },
    {
      id: 3,
      label: 'Manager',
    },
  ];

  radioOptions = [
    {
      id: 7,
      label: 'Public',
    },
    {
      id: 8,
      label: 'Only members visible',
    },
    {
      id: 9,
      label: 'private',
    },
  ];

  checkboxOptions = [
    { id: '1', label: 'Mon', checked: true },
    { id: '2', label: 'Tue' },
    { id: '3', label: 'Wed' },
    { id: '4', label: 'Thur' },
    { id: '5', label: 'Fri' },
    { id: '6', label: 'Sat' },
    { id: '0', label: 'Sun' },
  ];
  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };
  product = {
    code : 0,
    name : '',
    defaulPrice : 0.00,
    categoryId : 0,
    SDInPurchase : false,
    SDInSales : false,
    Description: ''
  }
  multipleSelectConfig: any;
  breadItem: Array<MenuConfig> = [
    {
      linkType: 'hrefLink',
      link: '',
      name: 'Home'
    },
    {
      linkType: 'routerLink',
      link: './home',
      name: 'Inventory'
    },
    {
      linkType: 'routerLink',
      link: 'add-category',
      name: 'Add Product'
    }
  ];
  ngOnInit() {
    this.multipleSelectConfig = {
      key: 'multipleSelect',
      label: 'Options(Multiple selection with delete)',
      isSearch: true,
      multiple: 'true',
      labelization: { enable: true, labelMaxWidth: '120px' },
      options: this.selectOptions,
    };
  }

}
