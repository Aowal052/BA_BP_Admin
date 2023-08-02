import { Component, ElementRef, ViewChild } from '@angular/core';
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
  generateInvoice() {
    // const doc = new jsPDF();
    const element = this.htmlElementToConvert.nativeElement;
  
    // html2canvas(element).then((canvas) => {
    //   const imageData = canvas.toDataURL('image/png');
    //   const imageWidth = 210; // Width of the PDF document (in mm)
    //   const imageHeight = (canvas.height * imageWidth) / canvas.width;
  
    //   // doc.addImage(imageData, 'PNG', 0, 0, imageWidth, imageHeight);
    //   // doc.save('converted.pdf');
    // });
  }

  // generateInvoice() {
  //   // Create a new jsPDF instance
  //   const doc = new jsPDF();
  // const element = this.htmlElementToConvert.nativeElement;
  //   // Set the font size and position for the invoice title
  //   doc.setFontSize(16);
  //   doc.text('Sales Invoice', 10, 10);
  //   doc.html(element)
  
  //   // Set the font size and position for the customer details
  //   doc.setFontSize(12);
  //   doc.text('Customer Name: John Doe', 10, 30);
  //   doc.text('Address: 123 Main St, City, Country', 10, 40);
    
  //   // Set the font size and position for the table headers
  //   doc.setFontSize(12);
  //   const headers = ['Product', 'Quantity', 'Price', 'Total'];
  //   const tableTop = 60;
  //   const tableLeft = 10;
  //   const columnWidth = 40;
  //   const rowHeight = 10;
  //   const cellPadding = 2;
    
  //   // Draw the table headers
  //   headers.forEach((header, columnIndex) => {
  //     const x = tableLeft + columnIndex * columnWidth;
  //     const y = tableTop;
  //     doc.text(header, x, y);
  //   });
    
  //   // Set the font size and position for the table rows
  //   doc.setFontSize(10);
  //   const products = [
  //     { name: 'Product 1', quantity: 2, price: 10, total: 20 },
  //     { name: 'Product 2', quantity: 3, price: 15, total: 45 },
  //     { name: 'Product 3', quantity: 1, price: 20, total: 20 },
  //   ];
    
  //   // Draw the table rows
  //   products.forEach((product, rowIndex) => {
  //     const x = tableLeft;
  //     const y = tableTop + (rowIndex + 1) * rowHeight;
  //     doc.text(product.name, x, y);
  //     doc.text(product.quantity.toString(), x + columnWidth, y);
  //     doc.text(product.price.toString(), x + columnWidth * 2, y);
  //     doc.text(product.total.toString(), x + columnWidth * 3, y);
  //   });
  
  //   // Calculate the total amount
  //   const totalAmount = products.reduce((sum, product) => sum + product.total, 0);
  
  //   // Set the font size and position for the total amount
  //   doc.setFontSize(12);
  //   doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 10, tableTop + (products.length + 2) * rowHeight);
  
  //   // Save the PDF file
  //   doc.save('sales-invoice.pdf');
  // }

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
