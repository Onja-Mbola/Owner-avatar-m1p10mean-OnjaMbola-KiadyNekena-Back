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
  // baseUri: string = 'http://192.168.88.18:3000/api/auth';
  baseUri: string = 'http://localhost:3000/api/auth';
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
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.token.signOut();
    this.isAuthenticated = false;
  }

}
