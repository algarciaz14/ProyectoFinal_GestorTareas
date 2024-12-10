import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectoForm!: FormGroup; // Uso del operador '!' para indicar que se inicializa en ngOnInit
  searchText: string = '';
  descripcionFiltro: string = '';

  // Propiedades para paginación
  page: number = 1; // Página inicial
  pageSize: number = 5; // Tamaño de página
  totalDepartamentos: number = 0; // Total de departamentos

  constructor(private proyectoService: ProyectoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.proyectoForm = this.fb.group({
      id: [null],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'), // Solo letras y espacios
        ],
      ],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'), // Solo letras y espacios
        ],
      ],
    });
    this.obtenerProyectos();
  }
  

  obtenerProyectos(): void {
    this.proyectoService.getProyectos().subscribe(
      (proyectos) => (this.proyectos = proyectos),
      () => Swal.fire('Error', 'No se pudieron obtener los proyectos.', 'error')
    );
  }

  agregarProyecto(): void {
    if (this.proyectoForm.valid) {
      const proyecto = this.proyectoForm.value;

      if (proyecto.id) {
        this.proyectoService.updateProyecto(proyecto).subscribe(() => {
          this.obtenerProyectos();
          this.resetearFormulario();
          Swal.fire('Éxito', 'Proyecto actualizado correctamente.', 'success');
        });
      } else {
        this.proyectoService.createProyecto(proyecto).subscribe(() => {
          this.obtenerProyectos();
          this.resetearFormulario();
          Swal.fire('Éxito', 'Proyecto creado correctamente.', 'success');
        });
      }
    }
  }

  updateProyecto(proyecto: Proyecto): void {
    this.proyectoForm.patchValue(proyecto);
  }

  eliminarProyecto(id?: number): void {
    if (id === undefined) {
      Swal.fire({
        title: 'Error',
        text: 'El ID del proyecto no es válido.',
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
        this.proyectoService.deleteProyecto(id).subscribe(() => {
          this.proyectos = this.proyectos.filter(proyecto => proyecto.id !== id);

          Swal.fire({
            title: 'Eliminado',
            text: 'El proyecto se eliminó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          Swal.fire({
            title: 'Error',
            text: 'No se puede eliminar proyecto, porque ya tiene una tarea asignada.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }
  resetearFormulario(): void {
    this.proyectoForm.reset();
  }
}

