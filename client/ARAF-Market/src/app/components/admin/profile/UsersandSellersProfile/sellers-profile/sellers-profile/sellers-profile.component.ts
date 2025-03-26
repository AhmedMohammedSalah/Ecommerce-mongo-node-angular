




// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-sellers-profile',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './sellers-profile.component.html',
//   styleUrl: './sellers-profile.component.css'
// })
// export class SellersProfileComponent implements OnInit {
//   sellers: any[] = [];
//   errorMessage: string = '';
//   successMessage: string = '';
  
//   private apiUrl = 'http://127.0.0.1:3000';

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.getAllSellers();
//   }

//   getAllSellers() {
//     this.http.get<any[]>(`${this.apiUrl}/all-sellers`)
//       .subscribe(
//         (response) => {
//           console.log('Raw Response:', response); 
//           // نقوم بتعيين isBlocked بناءً على isDeleted في بيانات البائع
//           this.sellers = response
//             .map(seller => ({
//               ...seller,
//               isBlocked: seller.isDeleted ?? false
//             }))


            
//             // نضمن أن الدور في بيانات userId هو "seller"
//             .filter(seller => seller.userId?.role === "seller");
  
//           console.log('Formatted Sellers:', this.sellers); 
//         },
//         (error) => {
//           this.errorMessage = 'Error fetching sellers!';
//           console.error('Error fetching sellers:', error);
//         }
//       );
//   }
  
//   toggleBlock(seller: any) {
//     console.log('Seller Before Toggle:', seller);
//     const newStatus = !seller.isBlocked;
//     const sellerId = seller._id;
    
//     if (!sellerId) {
//       this.errorMessage = '⚠️ Seller ID is missing!';
//       return;
//     }

//     if (newStatus) {
//       // إذا newStatus true: نقوم بعمل soft delete (حظر) عبر DELETE
//       this.http.delete(`${this.apiUrl}/seller/${sellerId}`)
//         .subscribe(
//           (response: any) => {
//             console.log(response.message);
//             seller.isBlocked = newStatus;
//             this.successMessage = `✅ Seller ${seller.userId.name} has been blocked.`;
//             setTimeout(() => { this.successMessage = ''; }, 3000);
//           },
//           (error) => {
//             console.error('❌ Error updating seller status:', error);
//             this.errorMessage = '❌ Failed to update seller status. Please try again!';
//             setTimeout(() => { this.errorMessage = ''; }, 3000);
//           }
//         );
//     } else {
//       // إذا newStatus false: نقوم بعمل PUT لاستعادة الحساب
//       this.http.put(`${this.apiUrl}/restore-seller/${sellerId}`, {})
//         .subscribe(
//           (response: any) => {
//             console.log(response.message);
//             seller.isBlocked = newStatus;
//             this.successMessage = `✅ Seller ${seller.userId.name} has been restored.`;
//             setTimeout(() => { this.successMessage = ''; }, 3000);
//           },
//           (error) => {
//             console.error('❌ Error updating seller status:', error);
//             this.errorMessage = '❌ Failed to update seller status. Please try again!';
//             setTimeout(() => { this.errorMessage = ''; }, 3000);
//           }
//         );
//     }
//   }
// }







import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sellers-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sellers-profile.component.html',
  styleUrl: './sellers-profile.component.css'
})
export class SellersProfileComponent implements OnInit {
  sellers: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllSellers();
  }

  getAllSellers() {
    this.http.get<any[]>(`${this.apiUrl}/all-sellers`)
      .subscribe(
        (response) => {
          console.log('Raw Response:', response);
          // نعتمد على isDeleted لتعيين isBlocked ونفترض أن بيانات البائع تحتوي على userId مع name, email, role
          this.sellers = response.map(seller => ({
            id: seller._id, 
            name: seller.userId?.name ?? 'Unknown',
            email: seller.userId?.email ?? 'Unknown',
            role: seller.userId?.role ?? 'seller',
            isBlocked: seller.isDeleted ?? false
          }))
          .filter(seller => seller.role === "seller");
          console.log('Formatted Sellers:', this.sellers);
        },
        (error) => {
          this.errorMessage = 'Error fetching sellers!';
          console.error('Error fetching sellers:', error);
        }
      );
  }
  
  toggleBlock(seller: any) {
    console.log('Seller Before Toggle:', seller);
    const newStatus = !seller.isBlocked;
    const sellerId = seller.id;
    
    if (!sellerId) {
      this.errorMessage = '⚠️ Seller ID is missing!';
      return;
    }

    if (newStatus) {
      // إذا newStatus true: حظر البائع (soft delete) عبر DELETE على /seller/:sellerId
      this.http.delete(`${this.apiUrl}/seller/${sellerId}`)
        .subscribe(
          (response: any) => {
            console.log(response.message);
            seller.isBlocked = newStatus;
            this.successMessage = `✅ Seller ${seller.name} has been blocked.`;
            setTimeout(() => { this.successMessage = ''; }, 3000);
          },
          (error) => {
            console.error('❌ Error updating seller status:', error);
            this.errorMessage = '❌ Failed to update seller status. Please try again!';
            setTimeout(() => { this.errorMessage = ''; }, 3000);
          }
        );
    } else {
      // إذا newStatus false: استعادة البائع عبر PUT على /restore-seller/:sellerId
      this.http.put(`${this.apiUrl}/restore-seller/${sellerId}`, {})
        .subscribe(
          (response: any) => {
            console.log(response.message);
            seller.isBlocked = newStatus;
            this.successMessage = `✅ Seller ${seller.name} has been restored.`;
            setTimeout(() => { this.successMessage = ''; }, 3000);
          },
          (error) => {
            console.error('❌ Error updating seller status:', error);
            this.errorMessage = '❌ Failed to update seller status. Please try again!';
            setTimeout(() => { this.errorMessage = ''; }, 3000);
          }
        );
    }
  }
}





