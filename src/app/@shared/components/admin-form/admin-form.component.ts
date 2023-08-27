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
  category = [{ id: 48, name: 'আইটেম-৪৫' }];
  defaultUnit = [{ id: 48, name: 'আইটেম-৪৫' }];
  KeyAccountManager = [{ id: 48, name: 'আইটেম-৪৫' }];
  masterCustomer= [{ id: 48, name: 'আইটেম-৪৫' }];
  DiscountType = [{ id: 48, name: 'আইটেম-৪৫' }];
  branchManager = [{ id: 48, name: 'আইটেম-৪৫' }];
  UserRoleId = [{ id: 48, name: 'আইটেম-৪৫' }];
  private searchString: any;
  
  searchFnBm = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.branchManager
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.branchManager
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };

  searchFnDy = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.DiscountType
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.DiscountType
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };

  searchFnMc = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.masterCustomer
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.masterCustomer
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };
  searchFnKm = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.KeyAccountManager
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.KeyAccountManager
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };
  searchFn = (term:any) => {
    if (this.searchString === term) {
      debugger
      return of(
        this.category
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.category
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };
  searchFnu = (term:any) => {
    
    if (this.defaultUnit != term) {
      debugger
      return of(
        this.defaultUnit
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.defaultUnit
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    }
  };

  searchRole = (term:any) => {
    
    if (this.UserRoleId != term) {
      debugger
      return of(
        this.UserRoleId
          .map((option, index) => ({ id: index, option: option }))
          .filter((item) => item.option.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
      );
    } else {
      this.searchString = term;
      return of(
        this.UserRoleId
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
    this.category = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'category') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name })); // Map the options to the desired format
    
    this.defaultUnit = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'dUnit') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

    this.KeyAccountManager = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'KeyAccountManager') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

    
    this.masterCustomer = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'masterCustomer') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

    this.DiscountType = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'DiscountType') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

    this.branchManager = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'branchManager') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

    this.UserRoleId = this.formConfig.items
    .filter((item: { type: string; prop:string }) => item.type === 'select' && item.prop === 'UserRoleId') // Filter items of type 'select'
    .flatMap((item: { options: any; }) => item.options || []) // Extract the options array from each item
    .map((option: { id: any; name: any; }) => ({ id: option.id, name: option.name }));

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
