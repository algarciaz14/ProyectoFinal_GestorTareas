import { Component, OnInit } from '@angular/core';
import { ResponsableService } from '../../services/responsable.service';
import { Responsable } from '../../models/responsable.model';
import { DepartamentoService } from '../../services/departamento.service';
import { PuestoService } from '../../services/puesto.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-responsables',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsablesComponent implements OnInit {
  responsables: Responsable[] = [];
  nuevoResponsable: Responsable = new Responsable(); 
  departamentos: { id: number; nombre: string }[] = [];
  puestos: { id: number; nombre: string }[] = [];
  isEditMode: boolean = false; 

  constructor(
    private responsableService: ResponsableService,
    private departamentosService: DepartamentoService,
    private puestosService: PuestoService
  ) {}

  ngOnInit(): void {
    this.obtenerResponsables();
    this.cargarDepartamentosYPuestos();
  }

  // Cargar los departamentos y puestos desde el backend
  cargarDepartamentosYPuestos(): void {
    this.departamentosService.getDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos.map(d => ({
        id: d.id || 0, // Asegurar que `id` nunca sea undefined
        nombre: d.nombre
      }));
    });
  
    this.puestosService.getPuestos().subscribe(puestos => {
      this.puestos = puestos.map(p => ({
        id: p.id || 0, // Asegurar que `id` nunca sea undefined
        nombre: p.nombre
      }));
    });
  }

  // Obtener los responsables desde el backend
  obtenerResponsables(): void {
    this.responsableService.getResponsables().subscribe(responsables => {
      this.responsables = responsables;
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cargar los responsables.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  // Agregar o actualizar un responsable
  agregarResponsable(responsableForm: NgForm): void {
    if (!this.nuevoResponsable.nombre || !this.nuevoResponsable.departamento || !this.nuevoResponsable.puesto) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }
  
    if (this.nuevoResponsable.id) {
      // Actualizar responsable
      this.responsableService.updateResponsable(this.nuevoResponsable).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Responsable actualizado con éxito.',
          });
          this.obtenerResponsables();
          this.nuevoResponsable = new Responsable();
          responsableForm.resetForm(); // Resetea el formulario
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el responsable.',
          });
          console.error('Error al actualizar el responsable:', error);
        }
      );
    } else {
      // Crear nuevo responsable
      this.responsableService.createResponsable(this.nuevoResponsable).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Creado',
            text: 'Responsable creado con éxito.',
          });
          this.obtenerResponsables();
          this.nuevoResponsable = new Responsable();
          responsableForm.resetForm(); // Resetea el formulario
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear el responsable.',
          });
          console.error('Error al crear el responsable:', error);
        }
      );
    }
  }
  

  // Eliminar un responsable
  eliminarResponsable(id: number | undefined): void {
    if (id === undefined) {
      Swal.fire({
        title: 'Error',
        text: 'El ID del responsable no es válido.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.responsableService.deleteResponsable(id).subscribe(() => {
          this.responsables = this.responsables.filter(responsable => responsable.id !== id);

          Swal.fire({
            title: 'Eliminado',
            text: 'El responsable se eliminó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar el responsable.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }

  // Rellenar el formulario para editar un responsable
  updateResponsable(responsable: Responsable): void {
    this.isEditMode = true; // Cambiar a modo edición
    this.nuevoResponsable = { ...responsable };
  }

  // Obtener nombre del puesto
  getPuestoNombre(id: number | null): string {
    if (!id) {
      return 'Sin asignar';
    }
    
    const puesto = this.puestos.find(p => p.id === id);
    return puesto ? puesto.nombre : 'Sin asignar';
  }

  // Obtener nombre del departamento
  getDepartamentoNombre(id: number | null): string {
    if (!id) {
      return 'Sin asignar';
    }
    
    const departamento = this.departamentos.find(d => d.id === id);
    return departamento ? departamento.nombre : 'Sin asignar';
  }
}
