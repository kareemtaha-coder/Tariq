import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  roles?: string;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token !== null) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn('Token expired');
          localStorage.removeItem('token'); // Clear expired token
          router.navigate(['/login']);
          return false;
        }
        if (decodedToken.roles) {

          localStorage.setItem('adminRole', decodedToken.roles);
        }
        return true; // Token is valid
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token'); // Remove invalid token
        router.navigate(['/login']);
        return false;
      }
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  return false;
};
