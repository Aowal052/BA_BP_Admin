import { Component, OnInit } from '@angular/core';
import { DFormData } from 'src/app/@shared/components/dynamic-forms/form-item.interface';
import { BreadCrumbService, MenuConfig } from 'ng-devui/breadcrumb';
import { HelperUtils } from 'ng-devui/common';
import { DialogService } from 'ng-devui/modal';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{
  formItems: DFormData = {};
  constructor(
    private breadCrumbService: BreadCrumbService,
     private dialogService: DialogService) { }
  ngOnInit(): void {
  }

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
      name: 'Add Category'
    }
  ];

  navigate(event: MouseEvent, item:any) {
    debugger
    this.canNavigate(item).then((can) => {
      if (!can) {
        return;
      }
      if(item.linkType === 'routerLink') {
        //this.breadCrumbService.navigateTo(event, item);
        HelperUtils.jumpOuterUrl(item.link, '_self');
      } else {
        HelperUtils.jumpOuterUrl(item.link, '_self');
      }
    });
  }

  canNavigate(item:any) {
    return new Promise((resolve) => {
      const results = this.dialogService.open({
        id: 'dialog-service',
        width: '300px',
        zIndex: 1050,
        maxHeight: '600px',
        title: 'Router?',
        content: `Are you sure to Router to ${item.name}?`,
        backdropCloseable: false,
        dialogtype: 'standard',
        buttons: [
          {
            cssClass: 'stress',
            text: 'Ok',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              resolve(true);
            }
          },
          {
            id: 'btn-cancel',
            cssClass: 'common',
            text: 'Cancel',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              resolve(false);
            }
          },
        ]
      });
    });
  }
}
