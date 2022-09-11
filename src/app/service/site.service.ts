import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Site } from '../model/mission';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  url = 'http://localhost:8080';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) { }

  deleteSite(site: Site): Observable<String> {
    return this.http.delete<string>(this.url + '/site/id/' + site.id + '/delete');
  }
  
  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(this.url + '/site').pipe(
      tap(sites => console.log('Sites :', sites))
    );
  }

  createSite(site: Site): Observable<Site> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Site>(this.url + '/site', site, httpOptions).pipe(
      tap(site => console.log('Created site :', site)),
      catchError(this.errorHandler.handleError)
    )
  }
}
