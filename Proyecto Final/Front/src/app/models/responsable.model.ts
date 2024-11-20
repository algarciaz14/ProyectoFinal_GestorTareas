export class Responsable {
    id?: number;
    nombre: string;
    apellido: string;
    correo: string;
    celular: string;
    departamento: { id: number; nombre: string } | null; 
    puesto: { id: number; nombre: string } | null;       
    departamentoNombre?: string;                         
    puestoNombre?: string;                               
  
    constructor() {
      this.nombre = '';
      this.apellido = '';
      this.correo = '';
      this.celular = '';
      this.departamento = null; 
      this.puesto = null;       
    }
  }
  