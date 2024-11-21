import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];
  responsables: any[] = [];
  proyectos: any[] = [];
  nuevaTarea: Tarea;
  isEditMode: boolean = false;

  constructor(private tareaService: TareaService) {
    this.nuevaTarea = new Tarea();
  }

  ngOnInit(): void {
    this.obtenerTareas();
    this.obtenerResponsables();
    this.obtenerProyectos();
  }

  obtenerTareas(): void {
    this.tareaService.getTareas().subscribe(tareas => {
      this.tareas = tareas.map(tarea => {
        if (tarea.responsable) {
          tarea.responsableNombre = `${tarea.responsable.nombre} ${tarea.responsable.apellido}`;
        }
        return tarea;
      });
    });
  }

  obtenerResponsables(): void {
    this.tareaService.getResponsables().subscribe(responsables => {
      this.responsables = responsables;
    });
  }

  obtenerProyectos(): void {
    this.tareaService.getProyectos().subscribe(proyectos => {
      this.proyectos = proyectos;
    });
  }

  agregarTarea(tareaForm: NgForm): void {  
    console.log("Datos de la nueva tarea antes de enviar:", this.nuevaTarea);
  
    // Solo enviar los identificadores (responsableId y proyectoId)
    const tareaDto = {
      ...this.nuevaTarea,
      proyectoId: this.nuevaTarea.proyecto?.id,
      responsableId: this.nuevaTarea.responsable?.id
    };
  
    console.log("Datos que se envían al servicio:", tareaDto);
  
    if (this.nuevaTarea.id) {
      // Si ya existe la tarea, actualizar
      this.tareaService.updateTarea(tareaDto).subscribe(() => {
        this.obtenerTareas();
        this.nuevaTarea = new Tarea();
        tareaForm.reset();  
  
        // Notificación de éxito para actualizar
        Swal.fire({
          title: 'Tarea actualizada',
          text: 'La tarea se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }, error => {
        console.error('Error al actualizar la tarea:', error);
      });
    } else {
      // Si no existe la tarea, crear una nueva
      this.tareaService.createTarea(tareaDto).subscribe(() => {
        this.obtenerTareas();
        this.nuevaTarea = new Tarea();
        tareaForm.reset();  
  
        // Notificación de éxito para agregar
        Swal.fire({
          title: 'Tarea creada',
          text: 'La tarea se ha creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }, error => {
        console.error('Error al agregar la tarea:', error);
      });
    }
  }
  
  eliminarTarea(id: number): void {
    if (id !== undefined && id !== null) {  // Verificar que el ID sea válido
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Confirma si deseas eliminar esta tarea.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarla',
        cancelButtonText: 'No, cancelar',
        buttonsStyling: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.tareaService.deleteTarea(id).subscribe(() => {
            this.tareas = this.tareas.filter(tarea => tarea.id !== id);
            Swal.fire(
              'Tarea eliminada',
              'La tarea ha sido eliminada correctamente',
              'success'
            );
          }, error => {
            console.error('Error al eliminar la tarea:', error);
          });
        }
      });
    } else {
      console.error('ID de tarea inválido');
    }
  }

  updateTarea(tarea: Tarea): void {
    this.isEditMode = true;
  
    // Buscar los objetos exactos en las listas
    const responsable = this.responsables.find(r => r.id === tarea.responsable?.id);
    const proyecto = this.proyectos.find(p => p.id === tarea.proyecto?.id);
  
    // Asignar la tarea seleccionada al modelo
    this.nuevaTarea = {
      ...tarea,
      responsable,
      proyecto,
    };
  }
  
}

