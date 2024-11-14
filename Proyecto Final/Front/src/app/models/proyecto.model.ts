export class Proyecto {
    id?: number;
    nombre!: string;
    descripcion!: string;

    constructor() {
        this.nombre = '';
        this.descripcion = '';
    }
}
