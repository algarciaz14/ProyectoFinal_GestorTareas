import { Pipe, PipeTransform } from '@angular/core';
import { Tarea } from '../models/tarea.model';

@Pipe({
  name: 'tareaOrder',
})
export class TareaOrderPipe implements PipeTransform {
  transform(
    tareas: Tarea[],
    searchText: string = '',
    searchPrioridad: string = '',
    searchEstado: string = '',
    searchResponsable: string = '',
    searchProyecto: string = '',
    orderBy: keyof Tarea = 'id',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Tarea[] {
    if (!tareas || !orderBy) return tareas; 

    // Filtrar por nombre, prioridad, estado, responsable y proyecto
    const filteredTareas = tareas.filter(tarea =>
      tarea.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
      tarea.prioridad.toLowerCase().includes(searchPrioridad.toLowerCase()) &&
      tarea.estado.toLowerCase().includes(searchEstado.toLowerCase()) &&
      tarea.responsable?.nombre.toLowerCase().includes(searchResponsable.toLowerCase()) &&
      tarea.proyecto?.nombre.toLowerCase().includes(searchProyecto.toLowerCase())
    );

    return filteredTareas.sort((a, b) => {
      const valueA = a[orderBy]; 
      const valueB = b[orderBy];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return orderDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return orderDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }
}

