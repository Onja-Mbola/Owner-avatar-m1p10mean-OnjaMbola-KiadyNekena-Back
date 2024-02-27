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

export class UserService {
  // baseUri: string = 'http://192.168.88.18:3000/api/auth';
  baseUri: string = 'http://localhost:3000/api/auth';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) {

  }

  getProfile(): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    return this.http.get(`${this.baseUri}/getInfoClient`, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }
  updateProfile(data): Observable<any> {
    let url = `${this.baseUri}/updateProfile`;
    return this.http.post(url, data, httpOptions);
  }


}
