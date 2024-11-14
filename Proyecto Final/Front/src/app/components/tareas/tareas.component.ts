import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';

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
    this.nuevaTarea = new Tarea(); // Inicializamos la nueva tarea
  }

  ngOnInit(): void {
    this.obtenerTareas();
    this.obtenerResponsables();
    this.obtenerProyectos();
  }

  
  obtenerTareas(): void {
    this.tareaService.getTareas().subscribe(tareas => {
      this.tareas = tareas.map(tarea => {
        // Asegurarnos de que el responsable esté completo
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


    agregarTarea(): void {
      console.log("Datos de la nueva tarea antes de enviar:", this.nuevaTarea);
      
      // Solo enviar los identificadores (responsableId y proyectoId)
      const tareaDto = {
        ...this.nuevaTarea,
        proyectoId: this.nuevaTarea.proyecto?.id,
        responsableId: this.nuevaTarea.responsable?.id  // Solo enviar el ID del responsable
      };
    
      console.log("Datos que se envían al servicio:", tareaDto);
    
      if (this.nuevaTarea.id) {
        // Si ya existe la tarea, actualizar
        this.tareaService.updateTarea(tareaDto).subscribe(() => {
          this.obtenerTareas();
          this.nuevaTarea = new Tarea();
        }, error => {
          console.error('Error al actualizar la tarea:', error);
        });
      } else {
        // Si no existe la tarea, crear una nueva
        this.tareaService.createTarea(tareaDto).subscribe(() => {
          this.obtenerTareas();
          this.nuevaTarea = new Tarea();
        }, error => {
          console.error('Error al agregar la tarea:', error);
        });
      }
    }
    
    
  
    

  eliminarTarea(id: number): void {
    if (id) {  // Verificar  que el id no sea undefined ni 0
      this.tareaService.deleteTarea(id).subscribe(() => {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id);
      }, error => {
        console.error('Error al eliminar la tarea:', error);
      });
    } else {
      console.error('ID de tarea inválido');
    }
  }

  updateTarea(tarea: Tarea): void {
    this.nuevaTarea = { ...tarea };
  }
}