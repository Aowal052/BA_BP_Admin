import { Component } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { Observable, delay, map, of } from 'rxjs';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent {

  projectFormData = {
    projectName: '',
    projectOwner: null,
    projectExecutor: null,
    projectLabels: [],
    projectCycleTime: [null, null],
    isPublic: true,
    projectExerciseDate: [{ id: '1', label: 'Mon' }],
  };

  OwnerOptions = [
    { id: '1', name: 'Owner1' },
    { id: '2', name: 'Owner2' },
    { id: '3', name: 'Owner3' },
    { id: '4', name: 'Owner4' },
  ];
  ExecutorOptions = [
    { id: '1', name: 'Executor1' },
    { id: '2', name: 'Executor2' },
    { id: '3', name: 'Executor3' },
    { id: '4', name: 'Executor4' },
  ];
  labelList = [
    {
      id: 1,
      label: 'OpenSource',
    },
    {
      id: 2,
      label: 'Admin',
    },
    {
      id: 3,
      label: 'DevUI',
    },
  ];

  securityValue = [
    {
      name: 'Public',
    },
    {
      name: 'Only member visible',
    },
  ];
  multipleSelectConfig: any;
  checkboxOptions = [
    { id: '1', label: 'Mon', checked: true },
    { id: '2', label: 'Tue' },
    { id: '3', label: 'Wed' },
    { id: '4', label: 'Thur' },
    { id: '5', label: 'Fri' },
    { id: '6', label: 'Sat' },
    { id: '0', label: 'Sun' },
  ];
  addedLabelList = [];
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
  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };
  columnsLayout: FormLayout = FormLayout.Columns;
  msgs: Array<Object> = [];
  existProjectNames = ['123', '123456', 'DevUI'];
  formItems: DFormData = {};
  selectedDate2 = new Date;
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
  dateConfig = {
    timePicker: true,
    dateConverter: null,
    min: 2019,
    max: 2040,
    format: {
      date: 'MM.dd.y',
      time: 'y-MM-dd HH:mm:ss'
    }
  };

  getValue(value:any) {
    console.log(value);
  }
  validateDate(value: any): Observable<any | null> {
    let message = null;
    for (const item of value) {
      if (item.id === '2') {
        message = {
          'en-us': 'The task queue on the current execution day (Tuesday) is full.',
        };
      }
    }
    return of(message).pipe(delay(300));
  }
  checkName(value: string) {
    debugger
    let res = true;
    if (this.existProjectNames.indexOf(value) !== -1) {
      res = false;
    }
    return of(res).pipe(delay(500));
  }
  submitProjectForm({ valid }: any) {
    if (valid) {
      of(this.formItems)
        .pipe(
          map((val) => 'success'),
          delay(500)
        )
        .subscribe((res) => {
          if (res === 'success') {
            this.showToast('success', 'Success', 'Registration succeeded.');
          }
        });
    } else {
      this.showToast('error', 'Error', 'Check whether all validation items pass.');
    }
  }
  showToast(type: any, title: string, msg: string) {
    this.msgs = [{ severity: type, summary: title, detail: msg }];
  }
}
