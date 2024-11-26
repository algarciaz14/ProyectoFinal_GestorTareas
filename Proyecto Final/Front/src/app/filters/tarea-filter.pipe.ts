import { Pipe, PipeTransform } from '@angular/core';
import { Tarea } from '../models/tarea.model';

@Pipe({
  name: 'tareaFilter'
})
export class TareaFilterPipe implements PipeTransform {

  transform(tareas: Tarea[], searchText: string, prioridad: string, responsable: string, estado: string, proyecto: string): Tarea[] {
    if (!tareas) return [];
    if (!searchText && !prioridad && !responsable && !estado && !proyecto) return tareas;

    // Filtrar por nombre
    let filteredTareas = tareas.filter(tarea => 
      tarea.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    // Filtrar por prioridad
    if (prioridad) {
      filteredTareas = filteredTareas.filter(tarea => 
        tarea.prioridad.toLowerCase().includes(prioridad.toLowerCase())
      );
    }

    // Filtrar por responsable
    if (responsable) {
      filteredTareas = filteredTareas.filter(tarea => 
        tarea.responsableNombre?.toLowerCase().includes(responsable.toLowerCase()) ?? false
      );
    }

    // Filtrar por estado
    if (estado) {
      filteredTareas = filteredTareas.filter(tarea => 
        tarea.estado.toLowerCase().includes(estado.toLowerCase())
      );
    }

    // Filtrar por proyecto
    if (proyecto) {
      filteredTareas = filteredTareas.filter(tarea => 
        tarea.proyecto?.nombre.toLowerCase().includes(proyecto.toLowerCase()) ?? false
      );
    }

    return filteredTareas;
  }
}

