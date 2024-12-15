import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puesto} from '../models/puesto.model';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {
  private apiUrl = 'http://localhost:8080/api/puestos';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  // Obtener todos los puestos
  getPuestos(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.apiUrl);
  }

  // Crear un nuevo puesto
  createPuesto(puesto: Puesto): Observable<Puesto> {
    return this.http.post<Puesto>(`${this.apiUrl}/create`, puesto, { headers: this.httpHeaders });
  }

  // Eliminar un puesto por ID
  deletePuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.httpHeaders });
  }

  // Actualizar un puestoexistente
  updatePuesto(puesto: Puesto): Observable<Puesto> {
    return this.http.put<Puesto>(`${this.apiUrl}/${puesto.id}`, puesto, { headers: this.httpHeaders });
  }

  //Filtro
    getPuestosByNombre(nombre: string): Observable<Puesto[]> {
      return this.http.get<Puesto[]>(`${this.apiUrl}/filterByNombre`, {
        params: { nombre },
      });
    }
}

