import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { Responsable } from '../../models/responsable.model';
import { DepartamentoService } from '../../services/departamento.service';
import { PuestoService } from '../../services/puesto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsablesComponent implements OnInit {
  responsables: Responsable[] = [];
  responsableForm: FormGroup;
  departamentos: { id: number; nombre: string }[] = [];
  puestos: { id: number; nombre: string }[] = [];
  isEditMode: boolean = false;

  // Propiedades de filtro
  searchText: string = '';
  apellidoFiltro: string = '';
  correoFiltro: string = '';
  celularFiltro: string = '';
  departamentoFiltro: string = '';
  puestoFiltro: string = '';

  // Propiedades para paginación
  page: number = 1;
  pageSize: number = 5;

  constructor(
    private fb: FormBuilder,
    private responsableService: ResponsableService,
    private departamentosService: DepartamentoService,
    private puestosService: PuestoService
  ) {
    this.responsableForm = this.fb.group({
      id: [null],
      //nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')]],
      apellido: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')]],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern('[0-9]{10}')]], 
      departamento: [null, Validators.required],
      puesto: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerResponsables();
    this.cargarDepartamentosYPuestos();
  }

  cargarDepartamentosYPuestos(): void {
    this.departamentosService.getDepartamentos().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos.map(d => ({
          id: d.id ?? 0, // Asignar un valor por defecto si es undefined
          nombre: d.nombre
        }));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los departamentos.', 'error');
      }
    });

    this.puestosService.getPuestos().subscribe({
      next: (puestos) => {
        this.puestos = puestos.map(p => ({
          id: p.id ?? 0, // Asignar un valor por defecto si es undefined
          nombre: p.nombre
        }));
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los puestos.', 'error');
      }
    });
  }

  obtenerResponsables(): void {
    this.responsableService.getResponsables().subscribe({
      next: (responsables) => {
        this.responsables = responsables;
      },
      error: () => {
        Swal.fire('Error', 'Hubo un problema al cargar los responsables.', 'error');
      }
    });
  }

  agregarResponsable(): void {
    if (this.responsableForm.invalid) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    const responsable: Responsable = this.responsableForm.value;

    if (responsable.id) {
      this.responsableService.updateResponsable(responsable).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Responsable actualizado con éxito.', 'success');
          this.obtenerResponsables();
          this.resetFormulario();
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al actualizar el responsable.', 'error');
        }
      });
    } else {
      this.responsableService.createResponsable(responsable).subscribe({
        next: () => {
          Swal.fire('Creado', 'Responsable creado con éxito.', 'success');
          this.obtenerResponsables();
          this.resetFormulario();
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al crear el responsable.', 'error');
        }
      });
    }
  }

  eliminarResponsable(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.responsableService.deleteResponsable(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El responsable se eliminó correctamente.', 'success');
            this.obtenerResponsables();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el responsable.', 'error');
          }
        });
      }
    });
  }

  updateResponsable(responsable: Responsable): void {
    this.isEditMode = true;
    this.responsableForm.patchValue({
      id: responsable.id,
      nombre: responsable.nombre,
      apellido: responsable.apellido,
      correo: responsable.correo,
      celular: responsable.celular,
      departamento: this.departamentos.find(d => d.id === responsable.departamento?.id) || null,
      puesto: this.puestos.find(p => p.id === responsable.puesto?.id) || null
    });
  }
  

  resetFormulario(): void {
    this.responsableForm.reset();
    this.isEditMode = false;
  }

  getPuestoNombre(id: number | null): string {
    const puesto = this.puestos.find((p) => p.id === id);
    return puesto ? puesto.nombre : 'Sin asignar';
  }

  getDepartamentoNombre(id: number | null): string {
    const departamento = this.departamentos.find((d) => d.id === id);
    return departamento ? departamento.nombre : 'Sin asignar';
  }
}
 