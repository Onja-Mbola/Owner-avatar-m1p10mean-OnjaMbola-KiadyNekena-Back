import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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


export class ServiceService {
  baseUri: string = 'http://localhost:3000/api/services-admin';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) {

  }
  // Get all service
  getServices() {
    return this.http.get(`${this.baseUri}`);
  }
  createService(data): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    let url = `${this.baseUri}/create`;
    const datachange = {
      models: 'Admin',
      modification: { $set: data }
    };
    return this.http
      .post(url, datachange, { headers: headers });
  }
}
