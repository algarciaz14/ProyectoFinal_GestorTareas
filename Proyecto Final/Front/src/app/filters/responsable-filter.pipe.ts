import { Pipe, PipeTransform } from '@angular/core';
import { Responsable } from '../models/responsable.model';

@Pipe({
  name: 'responsableOrder',
})
export class ResponsableOrderPipe implements PipeTransform {
  transform(
    responsables: Responsable[],
    searchText: string = '',
    searchApellido: string = '',
    searchCorreo: string = '',
    searchDepartamento: string = '',
    searchPuesto: string = '',
    orderBy: keyof Responsable = 'id',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Responsable[] {
    if (!responsables || !orderBy) return responsables; 

    // Filtrar por nombre, apellido, correo, departamento y puesto
    const filteredResponsables = responsables.filter(responsable =>
      responsable.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
      responsable.apellido.toLowerCase().includes(searchApellido.toLowerCase()) &&
      responsable.correo.toLowerCase().includes(searchCorreo.toLowerCase()) &&
      responsable.departamento?.nombre.toLowerCase().includes(searchDepartamento.toLowerCase()) &&
      responsable.puesto?.nombre.toLowerCase().includes(searchPuesto.toLowerCase())
    );

    return filteredResponsables.sort((a, b) => {
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

