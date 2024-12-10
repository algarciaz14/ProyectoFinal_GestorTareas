import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder, FormGroup y Validators
import { PuestoService } from '../../services/puesto.service';
import { Puesto } from '../../models/puesto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-puestos',
  templateUrl: './puesto.component.html', 
  styleUrls: ['./puesto.component.css'],
})
export class PuestosComponent implements OnInit {
  puestos: Puesto[] = [];
  nuevoPuestoForm: FormGroup; // Propiedad del formulario reactivo
  searchText: string = '';
  // Propiedades para paginación
  page: number = 1; // Página inicial
  pageSize: number = 5; // Tamaño de página
  totalDepartamentos: number = 0; // Total de departamentos

  constructor(
    private puestoService: PuestoService,
    private fb: FormBuilder // Inyectar FormBuilder
  ) {
    // Inicialización del formulario dentro del constructor
    this.nuevoPuestoForm = this.fb.group({
      id: [null],
      nombre: [
        '',
        [Validators.required, 
          Validators.minLength(4), 
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.obtenerPuestos();
  }

  // Obtener todos los puestos
  obtenerPuestos(): void {
    this.puestoService.getPuestos().subscribe(
      (puestos) => {
        this.puestos = puestos;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los puestos',
        });
      }
    );
  }

  // Crear o actualizar un puesto
  agregarPuesto(): void {
    if (this.nuevoPuestoForm.valid) {
      const puesto: Puesto = this.nuevoPuestoForm.value;
      
      if (puesto.id) {
        // Actualizar puesto existente
        this.puestoService.updatePuesto(puesto).subscribe(
          () => {
            this.obtenerPuestos();
            this.resetearFormulario();
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Puesto actualizado correctamente',
            });
          },
          (error) => {
            console.error('Error al actualizar el puesto:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el puesto',
            });
          }
        );
      } else {
        // Crear un nuevo puesto
        this.puestoService.createPuesto(puesto).subscribe(
          () => {
            this.obtenerPuestos();
            this.resetearFormulario();
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Puesto agregado correctamente',
            });
          },
          (error) => {
            console.error('Error al agregar el puesto:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo agregar el puesto',
            });
          }
        );
      }
    }
  }

  // Eliminar un puesto
  eliminarPuesto(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este puesto se eliminará permanentemente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.puestoService.deletePuesto(id).subscribe(
            () => {
              this.puestos = this.puestos.filter((puesto) => puesto.id !== id);
              Swal.fire('¡Eliminado!', 'El puesto ha sido eliminado', 'success');
            },
            (error) => {
              console.error('Error al eliminar el puesto:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el puesto, ya tiene un responsable asignado',
              });
            }
          );
        }
      });
    }
  }

  // Rellenar el formulario para editar un puesto
  updatePuesto(puesto: Puesto): void {
    this.nuevoPuestoForm.patchValue(puesto);
  }

  // Resetear el formulario
  private resetearFormulario(): void {
    this.nuevoPuestoForm.reset();
  }
}


