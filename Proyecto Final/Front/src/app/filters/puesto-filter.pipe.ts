import { Pipe, PipeTransform } from '@angular/core';
import { Puesto } from '../models/puesto.model';

@Pipe({
  name: 'puestoOrder',
})
export class PuestoOrderPipe implements PipeTransform {
  transform(
    puestos: Puesto[],
    orderBy: keyof Puesto = 'id',
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Puesto[] {
    if (!puestos || !orderBy) return puestos;

    return puestos.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      // Si el valor es un número, asegura la comparación correcta
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return orderDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Para cadenas, usa .localeCompare para una comparación más precisa
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return orderDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }

      // Si no es de tipo numérico ni string, se pueden comparar como cadenas vacías
      return 0; 
    });
  }
}