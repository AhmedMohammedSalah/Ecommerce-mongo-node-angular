export interface Draw {
    _id?: string;
    money: number;
    createdAt?: string; 
    updatedAt?: string;
  }
  
  export interface Review {
    customerId: string;
    reviewTxt?: string;
    rating: number; 
  }
  
  export interface SellerPI {
    _id: string;
    balance: number;
    draws: Draw[]; //==> list of draw transactions
    userId: string;
    businessName?: string;
    businessDetails?: Record<string, any>; //====> object
    bankDetails?: Record<string, any>; //===> object
    status: "pending" | "approved" | "rejected"; //===> enum
    reviews: Review[];
    products: Array<any>; 
    softDelete: boolean;
    orders: any[]; 
    createdAt?: string; 
    updatedAt?: string;
  }
  