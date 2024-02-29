import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  baseUri: string = 'https://m1p10mean-onjambola-kiadynekena-back-2.onrender.com/api/auth';
  // baseUri: string = 'http://localhost:3000/api/auth';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private isAuthenticated = false;

  constructor(private http: HttpClient,private token: TokenStorageService) {
    this.isAuthenticated = !!sessionStorage.getItem('auth-token');
  }

  // Login
  loginClient(credentials): Observable<any> {
    let url = `${this.baseUri}/loginClient`;
    return this.http.post(url, {
      email: credentials.email,
      password: credentials.password
    },httpOptions)
    }

    loginAdmin(credentials): Observable<any> {
    let url = `${this.baseUri}/loginEmploye`;
    return this.http.post(url, {
      email: credentials.email,
      password: credentials.password
    },httpOptions)
    }
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
  isClient(): boolean{
    let role =this.token.getUser().role;
    if(!role){
      return true;
    }else{
      return false;
    }
  }
  isAdmin(): boolean{
    let role =this.token.getUser().role;
    if(role){
      return true;
    }else{
      return false;
    }
  }

  logout(): void {
    this.token.signOut();
    this.isAuthenticated = false;
  }

}
