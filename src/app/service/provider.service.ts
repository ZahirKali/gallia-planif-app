import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Provider } from '../model/mission';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) { }

  deleteProvider(provider: Provider): Observable<String> {
    return this.http.delete<string>(this.url + '/provider/id/' + provider.id + '/delete');
  }
  getAll() : Observable<Provider[]> {
    return this.http.get<Provider[]>(this.url + '/provider').pipe(
      tap(providers => console.log('providers :', providers))
    );
  }
  
  createProvider(provider: Provider): Observable<Provider> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Provider>(this.url + '/provider', provider, httpOptions).pipe(
      tap(provider => console.log('Created provider :', provider)),
      catchError(this.errorHandler.handleError)
    )
  }
}
