import { Routes } from '@angular/router';
import { HomeComponent } from './components/Home/home/home.component';
import { NotFoundComponent } from './components/others/not-found/not-found.component';
import { RegisterComponent } from './components/Auth/register/register.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { ProfileComponent } from './components/customer/profile/profile.component';
import { UsersProfileComponent } from './components/admin/profile/UsersandSellersProfile/users-profile/users-profile/users-profile.component';
import { AdminProfileComponent } from './components/admin/profile/admin-profile/admin-profile.component';
import { SellersProfileComponent } from './components/admin/profile/UsersandSellersProfile/sellers-profile/sellers-profile/sellers-profile.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title:"ARAF-Market"
  },
  {
    path: 'register',
    component: RegisterComponent,
    title:"Register"
  },

  {
    path: 'login',
    component: LoginComponent,
    title:"Login"
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title:"profile"
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
			path:'**' ,
    component: NotFoundComponent,
      title:"Not Found"
  }
];
