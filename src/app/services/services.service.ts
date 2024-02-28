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
  getService(id): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    return this.http.get(`${this.baseUri}/read/${id}`, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }
  getServices() {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    return this.http.get(`${this.baseUri}`, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }
  createService(data): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    let url = `${this.baseUri}/create`;
    // const datachange = {
    //   models: 'Service',
    //   modification: { $set: data }
    // };
    return this.http
      .post(url, data, { headers: headers });
  }
  updateService(id,data): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    let url = `${this.baseUri}/update/${id}`;
    // const datachange = {
    //   models: 'Service',
    //   modification: { $set: data }
    // };
    return this.http
      .put(url, data, { headers: headers });
  }

  deleteService(id): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    let url = `${this.baseUri}/delete/${id}`;
    return this.http
      .delete(url, { headers: headers });
  }
}
