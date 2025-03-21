import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Seller } from '../../../../../../types/sellers.interface';
import { SellersService } from '../../../../../../services/API/sellers/sellers.service';

@Component({
  selector: 'app-sellers-profile',
  imports: [],
  templateUrl: './sellers-profile.component.html',
  styleUrl: './sellers-profile.component.css'
})
export class SellersProfileComponent {
  sellers: Seller[] = [];
  errorMessage: string = '';

  constructor(private sellerService: SellersService) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.sellerService.getSellers().subscribe({
      next: (data: Seller[]) => {
        this.sellers = data;
      },
      error: (error) => {
        console.error('Error fetching sellers:', error);
        this.errorMessage = '❌ Failed to load sellers. Please try again later.';
      }
    });
  }
}
