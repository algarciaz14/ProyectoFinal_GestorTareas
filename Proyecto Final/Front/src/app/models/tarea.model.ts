export class Tarea {
  id?: number;
  nombre: string;
  prioridad: string;
  //responsable: { id: number | undefined, nombre: string, apellido: string } | null;
  estado: string;
  //proyecto: { id: number | undefined, nombre: string } | null;
  responsable: { id?: number, nombre: string, apellido: string } | null;
  proyecto: { id?: number, nombre: string } | null;

  
  createAt: Date;
  createAtc: Date;
  responsableNombre: string | undefined;

  constructor() {
    this.nombre = '';
    this.prioridad = '';
    this.responsable = null;
    this.estado = '';
    this.proyecto = null;
    this.createAt = new Date();  // Fecha de registro actual
    this.createAtc = new Date();  // Fecha de cierre actual
  }
}


