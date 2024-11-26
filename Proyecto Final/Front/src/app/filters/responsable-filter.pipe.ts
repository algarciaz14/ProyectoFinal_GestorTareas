import { Pipe, PipeTransform } from '@angular/core';
import { Responsable } from '../models/responsable.model';

@Pipe({
  name: 'responsableFilter'
})
export class ResponsableFilterPipe implements PipeTransform {

  transform(
    responsables: Responsable[],
    nombre: string,
    apellido: string,
    correo: string,
    celular: string,
    departamento: string,
    puesto: string
  ): Responsable[] {
    if (!responsables) return [];
    if (!nombre && !apellido && !correo && !celular && !departamento && !puesto) return responsables;

    let filteredResponsables = responsables;

    // Filtrar por nombre
    if (nombre) {
      filteredResponsables = filteredResponsables.filter(responsable =>
        responsable.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    // Filtrar por apellido
    if (apellido) {
      filteredResponsables = filteredResponsables.filter(responsable =>
        responsable.apellido.toLowerCase().includes(apellido.toLowerCase())
      );
    }

    // Filtrar por correo
    if (correo) {
      filteredResponsables = filteredResponsables.filter(responsable =>
        responsable.correo.toLowerCase().includes(correo.toLowerCase())
      );
    }


    // Filtrar por departamento
    if (departamento) {
      filteredResponsables = filteredResponsables.filter(responsable => {
        const departamentoNombre = responsable.departamento?.nombre || responsable.departamentoNombre || '';
        return departamentoNombre.toLowerCase().includes(departamento.toLowerCase());
      });
    }

    // Filtrar por puesto
    if (puesto) {
      filteredResponsables = filteredResponsables.filter(responsable => {
        const puestoNombre = responsable.puesto?.nombre || responsable.puestoNombre || '';
        return puestoNombre.toLowerCase().includes(puesto.toLowerCase());
      });
    }

    return filteredResponsables;
  }
}
