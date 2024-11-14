import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea.model';
import { Responsable } from '../models/responsable.model'; 
import { Proyecto } from '../models/proyecto.model'; 


@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:8080/api/tareas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  getTareaById(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  createTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(`${this.apiUrl}/create`, tarea, { headers: this.httpHeaders });
  }

  updateTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${tarea.id}`, tarea, { headers: this.httpHeaders });
  }

  deleteTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.httpHeaders });
  }

  getResponsables(): Observable<any[]> {
    return this.http.get<Responsable[]>('http://localhost:8080/api/responsables');
  }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<any[]>('http://localhost:8080/api/proyectos');
  }
}
