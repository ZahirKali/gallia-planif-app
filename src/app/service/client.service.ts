import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Client } from '../model/mission';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) { }

  deleteClient(client: Client): Observable<String> {
    return this.http.delete<string>(this.url + '/client/id/' + client.id + '/delete');
  }
  getAll() : Observable<Client[]> {
    return this.http.get<Client[]>(this.url + '/client').pipe(
      tap(clients => console.log('Clients :', clients))
    );
  }
  
  createClient(client: Client): Observable<Client> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Client>(this.url + '/client', client, httpOptions).pipe(
      tap(client => console.log('Created client :', client)),
      catchError(this.errorHandler.handleError)
    )
  }
}
