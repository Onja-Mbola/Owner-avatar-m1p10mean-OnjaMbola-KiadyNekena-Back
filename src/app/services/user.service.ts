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
  baseUri: string = 'http://192.168.88.14:3000/api/auth';
  // baseUri: string = 'http://localhost:3000/api/auth';
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
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    let url = `${this.baseUri}/modifInfoClient`;
    const datachange = {
      models: 'Client',
      modification: { $set: data }
    };
    return this.http
      .put(url, datachange, { headers: headers });
  }


}
