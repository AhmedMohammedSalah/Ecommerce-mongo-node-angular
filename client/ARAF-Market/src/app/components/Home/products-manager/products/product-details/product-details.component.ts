import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../../services/API/product.service';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../../../../services/DATA/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HeaderComponent } from "../../../header/header.component";
import { FooterComponent } from "../../../footer/footer.component";

@Component({
  selector: 'app-product-details',
  imports: [DecimalPipe, DatePipe, NgIf, NgForOf, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product: any;
  quantity: number = 1;
  isLoggedIn: boolean = false;
  newReview: any = { productId: '', rating: 0, comment: '' };
  averageRating: number = 0;
  showSuccessMessage: boolean = false;
  isLoading: boolean = true;
  squares: number[] = Array(16).fill(0);
  seller: any;

  // Lazy load variables
  visibleReviews: any[] = []; // Reviews currently visible
  reviewsPerLoad: number = 5; // Number of reviews to load at a time
  currentLoadIndex: number = 0; // Current index for lazy loading

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthServiceService,
    private http: HttpClient,
    private router: Router
  ) {}

  // Add this to your component class
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.isLoading = true;

    // Auth subscription
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (loggedIn) => (this.isLoggedIn = loggedIn),
      error: (err) => console.error('Auth check failed:', err),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }

    this.newReview.productId = id;

    this.productService
      .getProductById(id)
      .pipe(
        switchMap((product: any) => {
          this.product = product;
          console.log(product);

          return this.productService.getSeller(product.sellerId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (seller) => {
          this.seller = seller;
          this.loadInitialReviews(); // Call this synchronously
          this.calculateAverageRating();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading product data:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Calculate average rating
  calculateAverageRating(): void {
    if (this.product.reviews && this.product.reviews.length > 0) {
      const totalRating = this.product.reviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      this.averageRating = totalRating / this.product.reviews.length;
    } else {
      this.averageRating = 0;
    }
  }

  // Get stars for rating display
  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    for (let i = 0; i < fullStars; i++) stars.push(1);
    if (halfStar) stars.push(0.5);
    while (stars.length < 5) stars.push(0);
    return stars;
  }

  // Submit review
  submitReview(): void {
    this.http.post('http://127.0.0.1:3000/review', this.newReview).subscribe(
      (response) => {
        console.log('Review submitted:', response);
        this.showSuccessMessage = true; // Show success message
        setTimeout(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/product-details', this.product._id]); // Reload the component
            });
        }, 2000); // Reload after 2 seconds
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
  // Load initial set of reviews
  loadInitialReviews(): void {
    this.currentLoadIndex = 0;
    this.visibleReviews = this.product.reviews.slice(0, this.reviewsPerLoad);
  }

  // Load more reviews
  loadMoreReviews(): void {
    this.currentLoadIndex += this.reviewsPerLoad;
    const nextReviews = this.product.reviews.slice(
      this.currentLoadIndex,
      this.currentLoadIndex + this.reviewsPerLoad
    );
    this.visibleReviews = [...this.visibleReviews, ...nextReviews];
  }
}
