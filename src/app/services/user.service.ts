import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
  // baseUri: string = 'http://192.168.88.14:3000/api/auth';
  baseUri: string = 'http://localhost:3000/api/auth';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private token: TokenStorageService,
  ) {

  }

  getProfile(): Observable<any> {
      if(!this.token.getUser().role){
        const headers = {
          Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
        };
        return this.http.get(`${this.baseUri}/getInfoClient`, { headers: headers }).pipe(
          map((res: Response) => {
            return res || {};
          })
        );
      } else {
        const headers = {
          Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
        };
        return this.http.get(`${this.baseUri}/getInfoEmploye`, { headers: headers }).pipe(
          map((res: Response) => {
            return res || {};
          })
        );
      }

  }

  getEmploye() {
    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
    };
    return this.http.get(`${this.baseUri}/getListeEmploye`, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      })
    );
  }

  loadImage(): Observable<string> {
    let imageUrl;

    if (!this.token.getUser().role) {
      imageUrl = `${this.baseUri}/getPhotoClient/${this.token.getUser().client_id}`;
    } else {
      imageUrl = `${this.baseUri}/getPhoto/${this.token.getUser().employe_id}`;
    }

    const headers = {
      Authorization: 'Bearer ' + this.token.getToken(),
    };

    return this.http.get(imageUrl, { responseType: 'blob', headers }).pipe(
      switchMap((data) => {
        return new Observable<string>((observer) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageSource = reader.result as string;
            observer.next(imageSource);
            observer.complete();
          };
          reader.readAsDataURL(data);
        });
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement de l\'image :', error);
        return throwError(() => error);
      })
    );
  }


  updateProfile(data): Observable<any> {
    if(!this.token.getUser().role){
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
    } else {
      const headers = {
        Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
      };
      let url = `${this.baseUri}/modifInfoEmploye`;
      const datachange = {
        models: 'Employe',
        modification: { $set: data }
      };
      return this.http
        .put(url, datachange, { headers: headers });
    }
  }

  createRDV(data): Observable<any> {
      const headers = {
        Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
      };
      let url = `${this.baseUri}/createRendezVous`;
      const datachange = {
        models: 'Employe',
        modification: { $set: data }
      };
      return this.http
        .put(url, datachange, { headers: headers });
  }


}
