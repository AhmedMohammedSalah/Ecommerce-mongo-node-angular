# MEAN Stack E-commerce Platform

A full-featured e-commerce platform built with the MEAN stack (MongoDB, Express.js, Angular, Node.js). This application supports multiple user roles, product management, shopping cart functionality, order processing, payment integration, and more.

## Features

### User Management
- Multi-role system (Customer, Seller, Admin)
- Registration with email verification
- Social media authentication
- Profile management
- Wishlist functionality
- Order tracking
- Review and rating system

### Product Management
- Hierarchical category system
- Detailed product listings with images
- Inventory management
- Advanced search and filtering

### Shopping Cart & Checkout
- Real-time cart management
- Guest checkout
- Multiple payment methods
- Promo code support

### Order Management
- Order placement and tracking
- Email notifications
- Order history

### Payment Integration
- Secure payment processing
- Multiple payment gateways (Stripe, PayPal)
- Saved payment methods

### Admin Panel
- User management
- Product and category management
- Order processing
- Discount management
- Content management

### Seller Features
- Seller dashboard
- Product management
- Order fulfillment
- Earnings tracking
- Payout management

### Marketing & Engagement
- Push notifications
- Email marketing
- Loyalty program
- Social sharing
- Promotional tools
- Multi-language support

## Technical Architecture

### Frontend (Angular)
- Angular 16+ with TypeScript
- Angular Material UI components
- NgRx for state management
- RxJS for reactive programming
- Responsive design (mobile-first approach)
- Lazy-loaded modules for better performance

### Backend (Node.js/Express)
- RESTful API architecture
- JWT authentication
- Role-based access control
- Email service integration
- File upload handling
- Payment gateway integration

### Database (MongoDB)
- Document-based data model
- Schema validation with Mongoose
- Indexing for performance
- Data relations through references

## Prerequisites

- Node.js (v16+)
- Angular CLI (v16+)
- MongoDB (v6+)
- npm or yarn

## Installation

### Clone the repository
```bash
git clone https://github.com/yourusername/mean-ecommerce.git
cd mean-ecommerce
```

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### Frontend Setup
```bash
# Navigate to the frontend directory