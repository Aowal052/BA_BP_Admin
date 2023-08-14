import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormLayout, SelectComponent } from 'ng-devui';
import { FormConfig } from './admin-form.type';
import { of } from 'rxjs';

@Component({
  selector: 'da-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
  @ViewChild('selectComponent', { static: true }) selectComponent!: SelectComponent;
  currentOption: any;
  currentIndex = 12;
  options = [{ id: 48, name: 'আইটেম-৪৫' }];

  private searchString: any;

  searchFn = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.options
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.options
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };

  loadMore(data: any) {
    debugger
    console.log('load more');
    this.selectComponent.forceSearchNext();
  }
  selectUnits = [
    {
      id: 2,
      name: 'Pcs',
    },
    {
      id: 1,
      name: 'Dzn',
    }
  ];
  @Input() formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [],
  };

  _formData: any = {};

  @Input() set formData(val: any) {
    this._formData = JSON.parse(JSON.stringify(val));
  }

  @Output() submitted = new EventEmitter();

  @Output() canceled = new EventEmitter();

  constructor() {}

  ngOnInit() {
    debugger
    this.options = this.formConfig.items
    .filter((item: { type: string; }) => item.type === 'select') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name })); // Map the options to the desired format
    this.formConfig.items.prop = this.currentOption;
    console.log(this.formConfig.items);
    debugger
  }

  valueChange(data: any){
    this.formConfig.items.prop = this.currentOption;
  }

  submitPlanForm({ valid }: { valid: boolean }) {
    if (valid) {
      this.submitted.emit(this._formData);
    }
  }

  

  cancel() {
    this.canceled.emit();
  }
}
