import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry, tap, throwError } from 'rxjs';
import { Collaborator } from '../model/collaborator';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  deleteCollaborator(collaborator: Collaborator) : Observable<string> {
    return this.http.delete<string>(this.url + '/collaborator/id/' + collaborator.id + '/delete');
  }

  url = 'http://localhost:8080';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) { }

  public createCollaborator(collaborator: Collaborator): Observable<Collaborator> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Collaborator>(this.url + '/collaborator', collaborator, httpOptions).pipe(
      tap(collaborator => console.log('Created collaborator :', collaborator)),
      catchError(this.errorHandler.handleError)
    )
  }

  public getAll(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.url + '/collaborator').pipe(
      tap(collaborators => console.log('Collaborators :', collaborators))
    );
  }
}
