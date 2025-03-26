import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Seller } from '../../../../../../types/sellers.interface';
import { SellersService } from '../../../../../../services/API/sellers/sellers.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sellers-profile',
  imports: [CommonModule],
  templateUrl: './sellers-profile.component.html',
  styleUrl: './sellers-profile.component.css'
})
export class SellersProfileComponent {
  sellers: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSellers();
  }

  getSellers() {
    this.http.get<any[]>('http://127.0.0.1:3000/all-Sellers')
      .subscribe(
        (data) => {
          console.log('Sellers:', data);
          this.sellers = data.map(seller => ({
            ...seller,
            isBlocked: false 
          }));
        },
        (error) => {
          console.error('Error fetching sellers:', error);
          this.errorMessage = 'Failed to load sellers!';
        }
      );
  }

  toggleBlock(seller: any) {
    seller.isBlocked = !seller.isBlocked; 
    console.log(`Seller ${seller.userId.name} is now ${seller.isBlocked ? 'Blocked' : 'Unblocked'}`);
  }
}
