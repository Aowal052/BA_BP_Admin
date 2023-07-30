import { Component, OnInit } from '@angular/core';
import { MenuConfig } from 'ng-devui';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-invoice-create-data-list',
  templateUrl: './invoice-create-data-list.component.html',
  styleUrls: ['./invoice-create-data-list.component.scss']
})
export class InvoiceCreateDataListComponent implements OnInit{
  router: any;
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
      name: 'Supply Chain'
    },
    {
      linkType: 'routerLink',
      link: 'supply-chain-list',
      name: 'Submit Invoice'
    }
  ];

  
}
