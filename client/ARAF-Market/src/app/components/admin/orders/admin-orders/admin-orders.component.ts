import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-admin-orders',
  standalone: true,  
  imports: [CommonModule, FormsModule],  
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {

  //orders-------------
  orders: any[] = [];
  tempStatus: string  = 'Pending';
  //-------------------

  // inject admin service: 
  constructor(private adminService: AdminService) {}

  
  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    
    this.adminService.getAllOrders().subscribe(
      (data: any) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  updateStatus(orderId: string, newStatus: string) {

    this.tempStatus = newStatus; 

    /*
    localStorage.setItem(`order_status_${orderId}`, newStatus);
    const savedStatus = localStorage.getItem(`order_status_${orderId}`);
    console.log("Saved Status:", savedStatus);

  
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe(
      (response) => {
        console.log('Order updated:', response);
        this.fetchOrders(); 
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }
  */
}

}
