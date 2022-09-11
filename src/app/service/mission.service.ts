import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Mission } from '../model/mission';
import { HttpErrorHandlerService } from './http-error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class MissionService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) { }
  getAll(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.url + '/mission');
  }

  createMission(mission: Mission): Observable<Mission> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Mission>(this.url + '/mission', mission, httpOptions).pipe(
      tap(site => console.log('Created site :', site)),
      catchError(this.errorHandler.handleError)
    )
  }

  deleteMission(mission: Mission): Observable<String> {
    return this.http.delete<string>(this.url + '/mission/id/' + mission.id + '/delete');
  }

}
