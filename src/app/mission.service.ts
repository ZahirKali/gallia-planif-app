import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Mission } from './mission';
import { Collaborator } from './Collaborator';

@Injectable({
  providedIn: 'root'
})
export class MissionService {


  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  getAllMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.url + '/mission');
  }

  createCollaborator(collaborator: Collaborator) : Observable<Collaborator> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Collaborator>(this.url + '/collaborator', collaborator, httpOptions)
  }

}
