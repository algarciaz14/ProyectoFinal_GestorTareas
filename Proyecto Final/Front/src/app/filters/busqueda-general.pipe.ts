import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaGeneral'
})
export class BusquedaGeneralPipe implements PipeTransform {
  transform(datos: any[], term: string): any[] {
    if (!datos || !term) return datos;

    const lowerTerm = term.toLowerCase();

    return datos.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];

        // Ignorar atributos no relevantes como IDs o fechas
        if (['id', 'createAt', 'createAtc'].includes(key)) return false;

        if (value && typeof value === 'object') {
          // Filtrar solo en propiedades relevantes de objetos
          return Object.values(value).some(subValue =>
            typeof subValue === 'string' && subValue.toLowerCase().includes(lowerTerm)
          );
        }

        // Procesar directamente strings y números
        return (
          (typeof value === 'string' && value.toLowerCase().includes(lowerTerm)) ||
          (typeof value === 'number' && value.toString().includes(lowerTerm))
        );
      });
    });
  }
}
