import { Pipe, PipeTransform } from '@angular/core';
import { Departamento } from '../models/departamento.model';

@Pipe({
  name: 'departamentoFilter'
})
export class DepartamentoFilterPipe implements PipeTransform {

  transform(
    departamentos: Departamento[], 
    nombre: string,
    
  ): Departamento[] {
    if (!departamentos) return [];
    if (!nombre) return departamentos;

    let filteredDepartamentos = departamentos;

    // Filtrar por nombre
    if (nombre) {
      filteredDepartamentos = filteredDepartamentos.filter(departamento =>
        departamento.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    return filteredDepartamentos;
  }

}
