import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];
  nuevoDepartamento: Departamento = new Departamento();

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.obtenerDepartamentos();
  }

  // Obtener todos los departamentos
  obtenerDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      (departamentos) => {
        this.departamentos = departamentos;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los departamentos.',
        });
      }
    );
  }

  // Crear o actualizar un departamento
  agregarDepartamento(form: NgForm): void {
    if (this.nuevoDepartamento.id) {
      // Actualizar departamento
      this.departamentoService.updateDepartamento(this.nuevoDepartamento).subscribe(
        () => {
          this.obtenerDepartamentos();
          this.resetearFormulario(form);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Departamento actualizado correctamente.',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el departamento.',
          });
        }
      );
    } else {
      // Crear nuevo departamento
      this.departamentoService.createDepartamento(this.nuevoDepartamento).subscribe(
        () => {
          this.obtenerDepartamentos();
          this.resetearFormulario(form);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Departamento creado correctamente.',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el departamento.',
          });
        }
      );
    }
  }

  // Eliminar un departamento
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
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el departamento, ya tiene una tarea asignada.',
              });
            }
          );
        }
      });
    }
  }

  // Rellenar formulario para editar un departamento
  updateDepartamento(departamento: Departamento): void {
    this.nuevoDepartamento = { ...departamento };
  }

  // Resetear el formulario
  private resetearFormulario(form: NgForm): void {
    this.nuevoDepartamento = new Departamento();
    form.resetForm();
  }
}
