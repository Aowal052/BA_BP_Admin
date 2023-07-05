import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { User } from 'src/app/@core/data/userData';
import { WorkGroup } from 'src/app/@core/data/work-group';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { UserDataService } from 'src/app/@core/mock/user-data.service';
import { WorkGroupService } from 'src/app/@core/mock/work-group.service';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';

@Component({
  selector: 'da-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.scss'],
})
export class UserCenterComponent implements OnInit {
  filterAreaShow = false;
  priorities = ['Low', 'Medium', 'High'];
  dataTableOptions = {
    columns: [
      {
        field: 'id',
        header: 'Id',
      },
      {
        field: 'title',
        header: 'Title',
      },
      {
        field: 'priority',
        header: 'Priority',
        filterable: true,
        filterList: [
          {
            id: 'Low',
            name: 'Low',
            value: 'Low',
          },
          {
            id: 'Medium',
            name: 'Medium',
            value: 'Medium',
          },
          {
            id: 'High',
            name: 'High',
            value: 'High',
          },
        ],
      },
      {
        field: 'iteration',
        header: 'Iteration',
      },
      {
        field: 'assignee',
        header: 'Assignee',
      },
      {
        field: 'status',
        header: 'Status',
        filterable: true,
        filterList: [
          {
            id: 'Stuck',
            name: 'Stuck',
            value: 'Stuck',
          },
          {
            id: 'Low',
            name: 'Low',
            value: 'Low',
          },
          {
            id: 'Working on it',
            name: 'Working on it',
            value: 'Working on it',
          },
        ],
      },
      {
        field: 'timeline',
        header: 'Timeline',
      },
    ],
  };
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'checkbox',
      width: '30px',
    },
    {
      field: 'id',
      width: '150px',
    },
    {
      field: 'title',
      width: '200px',
    },
    {
      field: 'priority',
      width: '100px',
    },
    {
      field: 'iteration',
      width: '100px',
    },
    {
      field: 'assignee',
      width: '100px',
    },
    {
      field: 'status',
      width: '100px',
    },
    {
      field: 'timeline',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '100px',
    },
  ];
  options = ['normal', 'borderless', 'bordered'];

  sizeOptions = ['sm', 'md', 'lg'];

  layoutOptions = ['auto', 'fixed'];

  searchForm: {
    borderType: '' | 'borderless' | 'bordered';
    size: 'sm' | 'md' | 'lg';
    layout: 'auto' | 'fixed';
  } = {
    borderType: '',
    size: 'md',
    layout: 'auto',
  };
  
  user: User = {};

  //busy!: Subscription;

  spaceBusy: Subscription = new Subscription();

  source = [
    { title: 'User Center' },
    {
      title: 'User Center',
      link: '/pages/user/center',
    },
  ];
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  activeTab: string | number = 'first';

  tabs = [
    {
      id: 'first',
      label: 'Sales',
    },
    {
      id: 'second',
      label: 'Purchase',
    },
  ];
  toastMessage:any;
  orders:any[] = [];
  articles:any[] = [];
  editForm: any = null;
  formData = {};
  editRowIndex = -1;
  projects = [];
  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate!: TemplateRef<any>;
  workGroups: WorkGroup[] = [];
  basicDataSource: Item[] = [];
  constructor(
    private userDataService: UserDataService,
     private workGroupService: WorkGroupService,
     private dialogService: DialogService,
     private listDataService: ListDataService,) {}

  ngOnInit() {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
    }
    this.workGroupService.getWorkGroups().subscribe((group) => {
      this.workGroups = group;
    });
    this.getListData();
  }

  getListData() {
    switch (this.activeTab) {
      case 'first':
        this.getArticles()
        //this.getSalesReport();
        return;
      case 'second':
        this.getPurchesReport();
        return;
    }
  }
  reset() {
    this.pager.pageIndex = 1;
    this.getSalesReport();
  }
  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getArticles();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getArticles();
  }
  async getArticles() {
    this.spaceBusy = (await this.userDataService.getArticles(ApiEndPoints.GetSalesReport, this.pager)).subscribe((res: OrderResponse) => {
      this.articles = res.data;
      this.pager.total = res.totalCount;
      debugger
    });
  }

  getList() {
    this.listDataService.getListData(this.pager).subscribe((res) => {
      const data = JSON.parse(JSON.stringify(res.pageList));
      this.basicDataSource = data;
      this.pager.total = res.total;
    });
  }
  
  // async getSalesReport() {
  //   (await this.userDataService.getSalesReport(ApiEndPoints.GetSalesReport, this.pager)).subscribe((res: OrderResponse) => {
  //     const data = JSON.parse(JSON.stringify(res.data));
  //     this.basicDataSource = data;
  //     this.pager.total = res.totalCount;
  //     debugger
  //   });
  // }
  async getSalesReport() {
    (await this.userDataService.getSalesReport(ApiEndPoints.GetSalesReport, this.pager)).subscribe((res: OrderResponse) => {
      res.$expandConfig = { expand: false };
      this.orders = res.data;
      this.pager.total = res.totalCount;
      debugger
    });
  }

  getPurchesReport() {
    this.spaceBusy = this.userDataService.getProjects().subscribe((res) => {
      this.projects = res;
    });
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Editor',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(index: number) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: ($event: Event) => {
            this.orders.splice(index, 1);
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
  activeTabChange(e: string | number) {
    this.getListData();
  }

  actionHandler(key: string, item: any) {
    if (item[key + 'Attached']) {
      item[key] -= 1;
    } else {
      item[key] += 1;
    }
    item[key + 'Attached'] = !item[key + 'Attached'];
  }
}
