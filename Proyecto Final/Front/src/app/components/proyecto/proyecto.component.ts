import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  nuevoProyecto: Proyecto = new Proyecto();
  // Propiedades de filtro
  searchText: string = '';
  descripcionFiltro: string = '';
  

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.obtenerProyectos();
  }

  // Obtener todos los proyectos
  obtenerProyectos(): void {
    this.proyectoService.getProyectos().subscribe(
      (proyectos) => {
        this.proyectos = proyectos;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los proyectos.',
        });
      }
    );
  }

  // Crear o actualizar un proyecto
  agregarProyecto(form: NgForm): void {
    if (this.nuevoProyecto.id) {
      // Actualizar proyecto
      this.proyectoService.updateProyecto(this.nuevoProyecto).subscribe(
        () => {
          this.obtenerProyectos();
          this.resetearFormulario(form);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Proyecto actualizado correctamente.',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el proyecto.',
          });
        }
      );
    } else {
      // Crear nuevo proyecto
      this.proyectoService.createProyecto(this.nuevoProyecto).subscribe(
        () => {
          this.obtenerProyectos();
          this.resetearFormulario(form);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Proyecto creado correctamente.',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el proyecto.',
          });
        }
      );
    }
  }

  // Eliminar un proyecto
  eliminarProyecto(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proyecto se eliminará permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.proyectoService.deleteProyecto(id).subscribe(
            () => {
              this.proyectos = this.proyectos.filter(
                (proyecto) => proyecto.id !== id
              );
              Swal.fire('¡Eliminado!', 'El proyecto ha sido eliminado.', 'success');
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el proyecto, ya tiene una tarea asignada.',
              });
            }
          );
        }
      });
    }
  }

  // Rellenar formulario para editar un proyecto
  updateProyecto(proyecto: Proyecto): void {
    this.nuevoProyecto = { ...proyecto };
  }

  // Resetear el formulario
  private resetearFormulario(form: NgForm): void {
    this.nuevoProyecto = new Proyecto();
    form.resetForm();
  }
}
