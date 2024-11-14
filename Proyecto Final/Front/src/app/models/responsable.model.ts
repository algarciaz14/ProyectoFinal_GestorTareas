import { Departamento } from './departamento.model';
import { Puesto } from './puesto.model';

export class Responsable {
    id?: number;
    nombre!: string;
    apellido!: string;
    correo!: string;
    celular!: string;
    departamento!: Departamento;  // Ahora es de tipo Departamento
    puesto!: Puesto;              // Ahora es de tipo Puesto

    constructor() {
        this.nombre = '';
        this.apellido = '';
        this.correo = '';
        this.celular = '';
        this.departamento = new Departamento(); // Instancia de Departamento
        this.puesto = new Puesto();             // Instancia de Puesto
    }
}
