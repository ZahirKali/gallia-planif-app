import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Mission } from '../model/mission';
import { Collaborator } from '../model/collaborator';


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  getAllMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.url + '/mission');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.error.message));
  }

}
