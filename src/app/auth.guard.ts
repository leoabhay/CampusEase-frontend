import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from './core/services/user_auth/user-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authservice = inject(UserAuthService)
  let isLoggedIn =localStorage.getItem('userData')
  // const isLoggedIn = authservice.isLoggedIn()

  if(!isLoggedIn){
    router.navigate(['/login'])
    return false;
  }
  return true;
};
// auth.guard.ts

// import { Injectable } from '@angular/core';
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   UrlTree,
//   Router
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { UserAuthService } from './core/services/user_auth/user-auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class authGuard implements CanActivate {

//   constructor(private authService: UserAuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.authService.isLoggedIn()) {
//       return true; // Allow navigation
//     } else {
//       // Navigate to login page with returnUrl
//       return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
//     }
//   }
// }