import { Pipe, PipeTransform } from '@angular/core';
import { Puesto } from '../models/puesto.model';

@Pipe({
  name: 'puestoFilter'
})
export class PuestoFilterPipe implements PipeTransform {

  transform(
    puestos: Puesto[], 
    nombre: string,
    
  ): Puesto[] {
    if (!puestos) return [];
    if (!nombre) return puestos;

    let filteredPuestos = puestos;

    // Filtrar por nombre
    if (nombre) {
      filteredPuestos = filteredPuestos.filter(puesto =>
        puesto.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    return filteredPuestos;
  }

}
