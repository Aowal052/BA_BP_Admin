import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { GatePassResponse } from 'src/app/@core/model/GatePassResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { SalesInvoiceResponse } from 'src/app/@core/model/SalesInvoiceResponse';
import { Vehicle, VehicleResponse } from 'src/app/@core/model/VehicleResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { GatePassService } from 'src/app/@core/services/gatepass/gate-pass.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesInvoiceService } from 'src/app/@core/services/salesinvoice/sales-invoice.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-gate-pass-create',
  templateUrl: './gate-pass-create.component.html',
  styleUrls: ['./gate-pass-create.component.scss']
})
export class GatePassCreateComponent implements OnInit {



  filterAreaShow = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  multipleSelectConfig: any;
  master: any = [];
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
  //---------------GatePass Date Start
  selectedDate1 = new Date();
  selectedDate2 = null;
  selectedDate3 = null;
  disabled = true;
  dateConfig = {
    timePicker: true,
    dateConverter: null,
    min: 2019,
    max: 2050,
    format: {
      date: 'MM.dd.y',
      time: 'y-MM-dd HH:mm:ss'
    }
  };
  //---------------GatePass Date End
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '60px',
    },
    {
      field: 'Product Name',
      width: '300px',
    },
    {
      field: 'Order Qnty',
      width: '100px',
    },
    {
      field: 'Unit',
      width: '100px',
    },
    {
      field: 'Unit Rate',
      width: '100px',
    },
    {
      field: 'Delivery Quny',
      width: '150px',
    },
    {
      field: 'Total Price',
      width: '100px',
    },
  ];

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
      link: 'challan-list',
      name: 'Gate Pass Create'
    }
  ];

  basicDataSource: any[] = [];

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'orderCode',
        prop: 'orderCode',
        type: 'input',
      },
      {
        label: 'customerName',
        prop: 'customerName',
        type: 'select',
        options: ['Low', 'Medium', 'High'],
      },
      {
        label: 'customerPhone',
        prop: 'customerPhone',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'orderAmount',
        prop: 'orderAmount',
        type: 'input',
      },
      {
        label: 'orderDate',
        prop: 'orderDate',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],
    labelSize: '',
  };
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
  addedLabelList = [];

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    PageIndex: 1,
    PageSize: 10,
    fromDate: null,
    toDate: null,
    customerId: 0,
    challanNo: '',
    orderNo: 0
  };

  rangeStart = new Date();
  rangeEnd = new Date();
  editableTip = EditableTip.btn;
  listData!: any[];
  orderMaster!: any[];

  VehicleInfo?: Vehicle;
  dropdownProductList: any[] = [];
  productList: any[] = [];
  busy!: Subscription;
  toastMessage: any;
  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate!: TemplateRef<any>;
  selectUnits = [
    {
      id: 1,
      label: 'Pcs',
    },
    {
      id: 2,
      label: 'Dzn',
    }
  ];
  //selectedVehicle = { id: 0, label: '', driverName: '' };

  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };
  masterData = {
    id: 0,
    challanNo: 0,
    orderDate: (new Date).toDateString(),
    orderNumber: 0,
    estimatedDeliveryDate: new Date,
    selectedVehicle: {},
    //selectedVehicle:{ id: 0, label: ''},//{id:0,label:'',driverName:''},
    selectedDiscount: { id: 0, name: '' },
    driverName: '',
    driverLicenseNo: '',
    driverPhone: '',
    remarks: '',
    selectedDate1: ''
  }
  VehicleRowData = {
    VehicleNo: '',
    driverName: '',
    driverPhone: '',
    driverLicenseNo: '',
  };
  VehicleDropdownList: any[] = [];
  vehicleList: any[] = [];
  selectedItem: string = '';
  isSelect: boolean = false;
  selectedId: string = '';
  msgs: Array<Object> = [];
  data: any;
  isActive: boolean = false;
  constructor(
    private SaleInvservice: SalesInvoiceService,
    private GatepassService: GatePassService,
    private dialogService: DialogService,
    private service: OrderService,
    private comService: CommonService,
  ) { }

  ngOnInit() {
    this.getList();
    this.getVehicleDropdown();
    this.multipleSelectConfig = {
      key: 'multipleSelect',
      label: 'Options(Multiple selection with delete)',
      isSearch: true,
      multiple: 'true',
      labelization: { enable: true, labelMaxWidth: '120px' },
      options: this.selectOptions,
    };
  }
  changeVehicle(vehicle: any) {
    this.VehicleInfo = this.VehicleDropdownList.find(x => x.id == vehicle.id);
    this.VehicleRowData.driverName = this.VehicleInfo?.driverName ?? '';
    this.VehicleRowData.driverLicenseNo = this.VehicleInfo?.driverLicenseNo ?? '';
    this.VehicleRowData.driverPhone = this.VehicleInfo?.driverPhone ?? '';

  }
  search() {
    this.getList();
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = async (rowItem: any, field: any) => {
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  async getList() {
    //const masterData = await this.comService.createFormDataObj(this.pager);
    this.busy = (await this.GatepassService.getChallanList(ApiEndPoints.GetChallanListGatePass, this.pager))
      .subscribe((res: SalesInvoiceResponse) => {
        debugger;
        const data = JSON.parse(JSON.stringify(res.data));
        this.basicDataSource = data;
        this.pager.total = res.totalCount;
      });
  }

  async getVehicleDropdown() {
    debugger
    this.busy = (await this.GatepassService.getVehicleDropdown(ApiEndPoints.GetVehicleDropdown))
      .subscribe((res: VehicleResponse) => {
        this.VehicleDropdownList = res.data;
        this.vehicleList = res.data.map(({ id, vehicleNo }) => ({ id: id, label: vehicleNo }));
      });
  }


  //this.basicDataSource.find(x=>x.id==row.id);

  async viewRow(row: any, index: number) {
    this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetChallanDetailsList, row.id))
      .subscribe((res: SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        debugger
        this.listData = data;
      });


    this.master = this.basicDataSource.find(x => x.id == row.id);
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '1000px',
      maxHeight: 'auto',
      title: 'Delivery Challan',
      showAnimate: true,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => { },
      buttons: [
      ],
    });
  }
  showToast(type: any, title: string, msg: string) {
    this.msgs = [{ severity: type, summary: title, detail: msg }];
  }
  onPageChange(e: number) {
    this.pager.PageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.PageSize = e;
    this.getList();
  }

  reset() {
    this.searchForm = {
      borderType: '',
      size: 'md',
      layout: 'auto',
    };
    this.pager.PageIndex = 1;
    this.getList();
  }

  onSubmitted(e: any) {
    this.editForm!.modalInstance.hide();
    this.basicDataSource.splice(this.editRowIndex, 1, e);
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
  selectStart(value: any) {
    console.log('start', value);
  }
  selectEnd(value: any) {
    console.log('end', value);
  }
  selectRange(value: any) {
    console.log(value);
  }




  deleteList: Item[] = [];
  items: Array<any> = [];
  onRowCheckChange(checked: boolean, rowIndex: number, nestedIndex: string, rowItem: any) {
    debugger
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    checked?this.items.push(rowItem):this.items.splice(rowIndex,1)
    this.items.length>0?this.isActive = true:this.isActive=false;
  }
  async placeGatePass(master: any) {
    const masterData = await this.comService.createFormData(master);

    const formData = new FormData();

    debugger
    const gatePassDate = new Date(); // Assuming you have the Date object

    // Formatting the date as 'YYYY-MM-DD' (e.g., '2023-07-20')
    const formattedDate = `${gatePassDate.getFullYear()}-${String(gatePassDate.getMonth() + 1).padStart(2, '0')}-${String(gatePassDate.getDate()).padStart(2, '0')}`;
    //const formattedDate = new Date()
    formData.append('GatePassDate', formattedDate);
    debugger
    formData.append('VehicleId', master.selectedVehicle.id);


    //Append list data
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      formData.append(`InvoiceNo`, item.invoiceNo);
    }

    (await this.GatepassService.createGatePass(ApiEndPoints.CreateGatePass, formData)).subscribe({
      next: (res: GatePassResponse) => {
        this.data = res;
        if (res.statusCode == HttpStatusCode.Ok) {
          this.msgs = [
            {
              severity: 'success',
              summary: orderPageNotification.orderPage.createMessage.summary,
              content: orderPageNotification.orderPage.createMessage.updateSuccess,
            },
          ];
        }
        this.getList();
        //this.editForm.modalInstance.hide();
      },
      error: (error) => {
        this.msgs = [
          {
            severity: 'error',
            summary: orderPageNotification.orderPage.createMessage.summary,
            content: error.error.error,
          },
        ];
      }
    });
  }
 
  // onCheckAllChange() {
  //   this.deleteList = this.datatable.getCheckedRows();
  // }
  // cancelRequest() {
  //   this.editForm.modalInstance.hide();
  // }

}
