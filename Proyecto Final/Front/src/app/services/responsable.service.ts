import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsable } from '../models/responsable.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {
  private apiUrl = 'http://localhost:8080/api/responsables';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getResponsables(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getResponsableById(id: number): Observable<Responsable> {
    return this.http.get<Responsable>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.post<Responsable>(`${this.apiUrl}/create`, responsable, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  updateResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.put<Responsable>(`${this.apiUrl}/${responsable.id}`, responsable, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  deleteResponsable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud', error);
    return throwError('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.');
  }
}
