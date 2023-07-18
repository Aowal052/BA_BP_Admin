import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EditableTip, TableWidthConfig } from 'ng-devui';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  rangeStart = new Date();
  rangeEnd = new Date();
  editableTip = EditableTip.btn;
  listData!:any[];
  orderMaster!:any[];
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'checkbox',
      width: '40px',
    },
    {
      field: 'id',
      width: '60px',
    },
    {
      field: 'Product Name',
      width: '300px',
    },
    {
      field: 'Quantity',
      width: '100px',
    },
    {
      field: 'Unit',
      width: '100px',
    },
    {
      field: 'Prev Del Qnty',
      width: '150px',
    },
    {
      field: 'Del Quny',
      width: '150px',
    },
    {
      field: 'Total Price',
      width: '100px',
    },
  ];
  masterData = {
    id:0,
    challanNo:0,
    orderDate:(new Date).toDateString(),
    orderNumber:0,
    estimatedDeliveryDate: new Date,
    selectedCustomer:{id:0,label:''},
    selectedDiscount: { id: 0, name: '' },
    totalPrice: 0,
    pdc:true,
    genDiscount:0,
    orderAmDiscount:0,
    otherDiscount:0,
    netAmount:0,
    deliveryInstruction:'',
    deliveryAddress:'',
    remarks:''
  }
  @ViewChild('htmlElementToConvert') htmlElementToConvert!: ElementRef;
  convertToPDF() {
    const doc = new jsPDF();
    const element = this.htmlElementToConvert.nativeElement;
  
    html2canvas(element).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const imageWidth = 210; // Width of the PDF document (in mm)
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
  
      doc.addImage(imageData, 'PNG', 0, 0, imageWidth, imageHeight);
      doc.save('converted.pdf');
    });
  }

  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };
  
   beforeEditEnd = async (rowItem: any, field: any) => {
    //await this.updateproduct(rowItem);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  items: Array<any> = [];
  onRowCheckChange(checked: boolean, rowIndex: number, nestedIndex: string, rowItem: any) {
    this.items.push(rowItem);
  }
  editForm: any = null;
  cancelRequest(){
    this.editForm.modalInstance.hide();
  }
}
