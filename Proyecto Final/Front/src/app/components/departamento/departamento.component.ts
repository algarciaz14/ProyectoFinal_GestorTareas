import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-departamentos',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];
  departamentoForm: FormGroup; // Formulario reactivo
  searchText: string = ''; // Propiedad para el filtro de búsqueda
  departamentoEnEdicion: Departamento | null = null;
  isEditing: boolean = false;


    // Propiedades para paginación
    page: number = 1; // Página inicial
    pageSize: number = 5; // Tamaño de página
    totalDepartamentos: number = 0; // Total de departamentos 


  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService
  ) {
    // Inicializa el formulario reactivo
    this.departamentoForm = this.fb.group({
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
    this.obtenerDepartamentos();
  }

  obtenerDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      (departamentos) => {
        this.departamentos = departamentos;
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los departamentos.',
        }); 
      }
    );
  } 

  agregarDepartamento(): void {
    if (this.departamentoForm.valid) {
      const departamento: Departamento = {
        id: this.departamentoEnEdicion?.id, // Si es edición, usa el ID del departamento en edición
        nombre: this.departamentoForm.value.nombre,
      };
  
      if (this.isEditing) {
        // Actualizar
        this.departamentoService.updateDepartamento(departamento).subscribe(
          () => {
            this.obtenerDepartamentos();
            this.resetearFormulario();
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Departamento actualizado correctamente.',
            });
          },
          () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el departamento.',
            });
          }
        );
      } else {
        // Crear
        this.departamentoService.createDepartamento(departamento).subscribe(
          () => {
            this.obtenerDepartamentos();
            this.resetearFormulario();
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Departamento creado correctamente.',
            });
          },
          () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el departamento.',
            });
          }
        );
      }
    }
  }
  

  eliminarDepartamento(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este departamento se eliminará permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.departamentoService.deleteDepartamento(id).subscribe(
            () => {
              this.departamentos = this.departamentos.filter(
                (departamento) => departamento.id !== id
              );
              Swal.fire('¡Eliminado!', 'El departamento ha sido eliminado.', 'success');
            },
            () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el departamento, ya tiene un responsable asignado.',
              });
            }
          );
        }
      });
    }
  }

  updateDepartamento(departamento: Departamento): void {
    this.departamentoEnEdicion = departamento;
    this.isEditing = true;
    this.departamentoForm.patchValue(departamento);
  }
  

  resetearFormulario(): void {
    this.departamentoForm.reset();
    this.isEditing = false;
    this.departamentoEnEdicion = null;
  }
  
}
