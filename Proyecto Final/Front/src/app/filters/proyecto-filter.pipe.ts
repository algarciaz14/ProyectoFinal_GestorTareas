import { Pipe, PipeTransform } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Pipe({
  name: 'proyectoFilter'
})
export class ProyectoFilterPipe implements PipeTransform {

  transform(
    proyectos: Proyecto[], 
    nombre: string,
    descripcion: string,
  ): Proyecto[] {
    if (!proyectos) return [];
    if (!nombre && !descripcion) return proyectos;

    let filteredProyectos = proyectos;

    // Filtrar por nombre
    if (nombre) {
      filteredProyectos = filteredProyectos.filter(proyecto =>
        proyecto.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    // Filtrar por descripcion
    if (descripcion) {
      filteredProyectos = filteredProyectos.filter(proyecto =>
        proyecto.descripcion.toLowerCase().includes(descripcion.toLowerCase())  // Corrección aquí
      );
    }
    return filteredProyectos;
  }
}
