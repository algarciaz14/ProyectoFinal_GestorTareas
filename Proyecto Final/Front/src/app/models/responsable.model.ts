import { Departamento } from './departamento.model';
import { Puesto } from './puesto.model';

export class Responsable {
    id?: number;
    nombre!: string;
    apellido!: string;
    correo!: string;
    celular!: string;
    departamentoId!: number;  // Cambia a almacenar solo el ID
    puestoId!: number;        // Cambia a almacenar solo el ID

    constructor() {
        this.nombre = '';
        this.apellido = '';
        this.correo = '';
        this.celular = '';
        this.departamentoId = 0;
        this.puestoId = 0;
    }
}
