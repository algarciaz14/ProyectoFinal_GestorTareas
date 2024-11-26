import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  nuevoPuesto: Puesto = new Puesto();
  // Propiedades de filtro
  searchText: string = '';

  constructor(private puestoService: PuestoService) {}

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
  agregarPuesto(form: NgForm): void {
    if (this.nuevoPuesto.id) {
      // Actualizar puesto existente
      this.puestoService.updatePuesto(this.nuevoPuesto).subscribe(
        () => {
          this.obtenerPuestos();
          this.resetearFormulario(form);
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
      this.puestoService.createPuesto(this.nuevoPuesto).subscribe(
        () => {
          this.obtenerPuestos();
          this.resetearFormulario(form);
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
    this.nuevoPuesto = { ...puesto };
  }

  // Resetear el formulario
  private resetearFormulario(form?: NgForm): void {
    this.nuevoPuesto = new Puesto();
    form?.resetForm(); // Resetea el formulario y los controles
  }
}
