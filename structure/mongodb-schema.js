// MongoDB Schema Mapping for E-commerce Platform

// Users Collection
{
  _id: ObjectId,
  email: String,          // Unique, required
  phone: String,          // Optional
  password: String,       // Hashed, required
  name: {
    first: String,
    last: String
  },
  address: {              // Optional
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialAuth: {           // Optional for social login
    provider: String,     // 'google', 'facebook', etc.
    id: String
  },
  resetToken: String,     // For password reset
  resetTokenExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}

// Profiles Collection
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users'
  },
  paymentMethods: [       // Array of saved payment methods
    {
      type: String,       // 'card', 'paypal', etc.
      default: Boolean,
      cardDetails: {       // For credit cards
        lastFour: String,  // Last 4 digits only
        brand: String,
        expiryMonth: Number,
        expiryYear: Number,
        // Never store full card numbers
      },
      paypalEmail: String  // For PayPal
    }
  ],
  wishlist: [             // Array of product IDs
    {
      type: ObjectId,
      ref: 'Products'
    }
  ],
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  notifications: {
    email: {
      marketing: Boolean,
      orderUpdates: Boolean,
      promotions: Boolean
    },
    push: {
      marketing: Boolean,
      orderUpdates: Boolean,
      promotions: Boolean
    }
  }
}

// Categories Collection
{
  _id: ObjectId,
  name: String,           // Required, unique
  description: String,
  parentId: {             // For subcategories
    type: ObjectId,
    ref: 'Categories',
    default: null
  },
  image: String,          // URL to category image
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Products Collection
{
  _id: ObjectId,
  name: String,           // Required
  description: String,    // Required
  price: Number,          // Required
  salePrice: Number,      // Optional, for discounted items
  images: [String],       // Array of image URLs
  categoryId: {
    type: ObjectId,
    ref: 'Categories'
  },
  sellerId: {
    type: ObjectId,
    ref: 'Sellers'
  },
  stockQuantity: Number,  // Required
  attributes: {           // Optional product attributes
    color: String,
    size: String,
    weight: Number,
    // Other product-specific attributes
  },
  rating: {
    average: Number,
    count: Number
  },
  tags: [String],         // For search and categorization
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Carts Collection
{
  _id: ObjectId,
  userId: {               // Null for guest users
    type: ObjectId,
    ref: 'Users',
    default: null
  },
  sessionId: String,      // For guest carts
  items: [
    {
      productId: {
        type: ObjectId,
        ref: 'Products'
      },
      name: String,       // Store name to avoid lookups
      price: Number,      // Store price at time of adding
      quantity: Number,
      image: String       // Main product image
    }
  ],
  promoCode: String,      // Applied promo code
  createdAt: Date,
  updatedAt: Date
}

// Orders Collection
{
  _id: ObjectId,
  orderNumber: String,    // Human-readable order ID
  userId: {
    type: ObjectId,
    ref: 'Users',
    default: null         // For guest orders
  },
  items: [
    {
      productId: {
        type: ObjectId,
        ref: 'Products'
      },
      sellerId: {
        type: ObjectId,
        ref: 'Sellers'
      },
      name: String,
      price: Number,      // Price at time of purchase
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String
  },
  paymentMethod: String,  // 'credit_card', 'paypal', 'cod', 'wallet'
  paymentId: String,      // Reference ID from payment processor
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  promoCodeUsed: String,
  notes: String,          // Customer or admin notes
  createdAt: Date,
  updatedAt: Date
}

// Reviews Collection
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users'
  },
  productId: {
    type: ObjectId,
    ref: 'Products'
  },
  orderId: {
    type: ObjectId,
    ref: 'Orders'
  },
  rating: {               // 1-5 stars
    type: Number,
    min: 1,
    max: 5
  },
  title: String,
  comment: String,
  images: [String],       // Optional review images
  isVerifiedPurchase: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Sellers Collection
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users'
  },
  businessName: String,
  businessDetails: {
    type: String,         // 'individual', 'company'
    description: String,
    logo: String,         // URL to logo
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    taxId: String,
    registrationNumber: String
  },
  bankDetails: {
    accountName: String,
    accountNumber: String, // Consider encryption
    bankName: String,
    ifscCode: String,     // Or equivalent routing code
    branch: String
  },
  commission: {           // Platform commission rate
    type: Number,
    default: 10           // 10%
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  ratings: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// Promos Collection
{
  _id: ObjectId,
  code: String,           // Required, unique
  discountType: {
    type: String,
    enum: ['percentage', 'fixed']
  },
  discount: Number,       // Percentage or fixed amount
  minOrderValue: Number,  // Minimum order value to apply
  maxDiscount: Number,    // Maximum discount amount
  validFrom: Date,
  validUntil: Date,
  applicableProducts: [   // Specific products or all
    {
      type: ObjectId,
      ref: 'Products'
    }
  ],
  applicableCategories: [ // Specific categories or all
    {
      type: ObjectId,
      ref: 'Categories'
    }
  ],
  usageLimit: Number,     // Total allowed uses
  perUserLimit: Number,   // Uses per user
  usageCount: Number,     // Current usage count
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Notifications Collection
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users'
  },
  type: String,           // 'order', 'promotion', 'system'
  title: String,
  message: String,
  isRead: Boolean,
  actionUrl: String,      // URL to navigate to when clicked
  createdAt: Date
}

// Payment Transactions Collection
{
  _id: ObjectId,
  orderId: {
    type: ObjectId,
    ref: 'Orders'
  },
  userId: {
    type: ObjectId,
    ref: 'Users'
  },
  amount: Number,
  currency: String,
  paymentMethod: String,
  paymentGateway: String, // 'stripe', 'paypal', etc.
  transactionId: String,  // ID from payment gateway
  status: {
    type: String,
    enum: ['pending', 'success', 'failed']
  },
  gatewayResponse: Object, // Raw response from gateway
  createdAt: Date
}

// Seller Payouts Collection
{
  _id: ObjectId,
  sellerId: {
    type: ObjectId,
    ref: 'Sellers'
  },
  amount: Number,
  orders: [
    {
      type: ObjectId,
      ref: 'Orders'
    }
  ],
  fees: Number,           // Platform fees
  tax: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed']
  },
  paymentMethod: String,
  transactionId: String,
  notes: String,
  createdAt: Date,
  paidAt: Date
}
