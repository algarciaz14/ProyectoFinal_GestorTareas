import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Responsable } from '../models/responsable.model';
import { Departamento } from '../models/departamento.model';
import { Puesto } from '../models/puesto.model';

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

  getPuestos(): Observable<Puesto[]> {
    return this.http.get<any[]>('http://localhost:8080/api/puestos');
  }

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<any[]>('http://localhost:8080/api/departamentos');
  }

  //Filtro para nombre
    getResponsablesByNombre(nombre: string): Observable<Responsable[]> {
      return this.http.get<Responsable[]>(`${this.apiUrl}/filterByNombre`, {
        params: { nombre },
      });
    }
  
  //Filtro para apellido
  getResponsablesByApellido(apellido: string): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}/filterByApellido`, {
      params: { apellido },
    });
  }

  //Filtro para correo
  getResponsablesByCorreo(correo: string): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}/filterByCorreo`, {
      params: { correo },
    });
  }

  //Filtro para departamento
  getResponsablesByDepartamento(departamento: string): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}/filterByDepartamento`, {
      params: { departamento },
    });
  }

  //Filtro para puesto
  getResponsablesByPuesto(puesto: string): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}/filterByPuesto`, {
      params: { puesto },
    });
  }
}
