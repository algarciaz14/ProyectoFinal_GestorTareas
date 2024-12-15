import { Pipe, PipeTransform } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Pipe({
  name: 'proyectoOrder',
})
export class ProyectoOrderPipe implements PipeTransform {
  transform(
    proyectos: Proyecto[],
    searchText: string = '',
    searchDescripcion: string = '',
    orderBy: keyof Proyecto = 'id',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Proyecto[] {
    if (!proyectos || !orderBy) return proyectos; 

    // Filtrar por nombre y descripción
    const filteredProyectos = proyectos.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
      proyecto.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
    );

    return filteredProyectos.sort((a, b) => {
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
