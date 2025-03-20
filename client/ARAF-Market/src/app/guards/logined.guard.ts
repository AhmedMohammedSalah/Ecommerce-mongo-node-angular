import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginedGuard: CanActivateFn = (route, state) => {
 const router = inject(Router); 
  if (localStorage.getItem('token')&&localStorage.getItem('user')) {
    return true; 
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
  
    
};
