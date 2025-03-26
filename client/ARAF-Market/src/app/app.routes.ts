import { Routes } from '@angular/router';
import { HomeComponent } from './components/Home/home/home.component';
import { NotFoundComponent } from './components/others/not-found/not-found.component';
import { RegisterComponent } from './components/Auth/register/register.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { ProfileComponent } from './components/customer/profile/profile.component';
import { UsersProfileComponent } from './components/admin/profile/UsersandSellersProfile/users-profile/users-profile/users-profile.component';
import { AdminProfileComponent } from './components/admin/profile/admin-profile/admin-profile.component';
import { SellersProfileComponent } from './components/admin/profile/UsersandSellersProfile/sellers-profile/sellers-profile/sellers-profile.component';
import { loginedGuard } from './guards/logined.guard';
import { UnauthorizedComponent } from './components/others/unauthorized/unauthorized.component';
import { SellerProfileComponent } from './components/seller/seller-profile/seller-profile.component';
import { ProductDetailsComponent } from './components/Home/products-manager/products/product-details/product-details.component';
import { WhichlistComponent } from './components/Home/whichlist/whichlist.component';
import { CartComponent } from './components/Home/cart/cart.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ProductsComponent } from './components/admin/products/products.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ARAF-Market',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'profile',
    canActivate: [loginedGuard],
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  // [SENU] seller routes adding
  {
    path: 'seller-dashboard',
    component: SellerProfileComponent,
    title: 'Seller Dashboard',
  },
  
  {
    path: 'admin-dashboard',
    component: AdminProfileComponent,
    title:"profile"
  },
  {
    path: 'users',
    component: UsersProfileComponent,
    title:"profile"
  },
  
  {
    path: 'sellers',
    component: SellersProfileComponent,
    title:"profile"
  },

  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
    title: 'product-details',
  },
  {
    path: 'whichlist',
    component: WhichlistComponent,
    title: 'whichlist',
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'cart',
  },

  {
    path: 'admin',
    component: AdminDashboardComponent, 
    children: [
      { path: 'products', component: ProductsComponent, title: "Manage Products" },
      { path: 'users', component:AdminProfileComponent, title: "Manage Users" },
    ]
  },

  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];
