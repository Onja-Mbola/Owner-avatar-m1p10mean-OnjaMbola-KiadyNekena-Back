import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Update this path based on your actual implementation

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    return this.checkAuth();
  }
  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser() && this.authService.isClient()) {
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/dashboard-admin']);
      return false;
    }
  }

}
