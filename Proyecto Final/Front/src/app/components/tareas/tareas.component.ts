import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';
import { Responsable } from '../../models/responsable.model';
import { Proyecto } from '../../models/proyecto.model';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  tareaForm: FormGroup; // Formulario reactivo
  tareas: Tarea[] = []; //Arrays que almacenan los datos obtenidos del backend.
  responsables: Responsable[] = [];  //Arrays que almacenan los datos obtenidos del backend.
  proyectos: Proyecto[] = []; //Arrays que almacenan los datos obtenidos del backend.
  isEditMode: boolean = false; // Modo edición

  // Variables filtros
  searchText: string = '';
    searchPrioridad: string = '';
    searchEstado: string = '';
    searchResponsable: string = '';
    searchProyecto: string = '';

  puestoEnEdicion: Tarea| null = null;
    isEditing: boolean = false;
    orderBy: keyof Tarea = 'id'; 
    orderDirection: 'asc' | 'desc' = 'asc'; 

  // Propiedades para paginación
  page: number = 1; // Página inicial
  pageSize: number = 5; // Tamaño de página
  totalDepartamentos: number = 0; // Total de departamentos

  constructor(private fb: FormBuilder, private tareaService: TareaService) {
    // Inicialización del formulario reactivo
    this.tareaForm = this.fb.group({
      id: [null], // Para identificar si se está editando
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')]],
      prioridad: ['', Validators.required],
      responsable: [null, Validators.required],
      estado: ['', Validators.required],
      proyecto: [null, Validators.required]
    });
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

  onSubmit(): void {
    if (this.tareaForm.invalid) {
      this.tareaForm.markAllAsTouched(); // Marca todos los controles como tocados
      return;
    }

    const formValue = this.tareaForm.value;
    const tareaDto = {
      ...formValue,
      proyectoId: formValue.proyecto?.id,
      responsableId: formValue.responsable?.id
    };

    if (formValue.id) {
      // Si existe ID, actualizar tarea
      this.tareaService.updateTarea(tareaDto).subscribe(() => {
        this.obtenerTareas();
        this.resetForm();
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
      // Crear nueva tarea
      this.tareaService.createTarea(tareaDto).subscribe(() => {
        this.obtenerTareas();
        this.resetForm();
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
    if (id !== undefined && id !== null) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Confirma si deseas eliminar esta tarea.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarla',
        cancelButtonText: 'No, cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.tareaService.deleteTarea(id).subscribe(() => {
            this.tareas = this.tareas.filter(tarea => tarea.id !== id);
            Swal.fire('Tarea eliminada', 'La tarea ha sido eliminada correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar la tarea:', error);
          });
        }
      });
    }
  }

  updateTarea(tarea: Tarea): void {
    this.isEditMode = true;

    const responsable = this.responsables.find(r => r.id === tarea.responsable?.id);
    const proyecto = this.proyectos.find(p => p.id === tarea.proyecto?.id);

    this.tareaForm.setValue({
      id: tarea.id,
      nombre: tarea.nombre,
      prioridad: tarea.prioridad,
      responsable: responsable || null,
      estado: tarea.estado,
      proyecto: proyecto || null
    });
  }

  resetForm(): void {
    this.tareaForm.reset();
    this.isEditMode = false;
  }

  buscarTareasPorNombre(nombre: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (nombre.trim() === '') {
      this.obtenerTareas(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.tareaService.getTareasByNombre(nombre).subscribe(
        (tareas) => {
          this.tareas = tareas; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.tareas.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron tareas que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener las tareas.',
          });
        }
      );
    }
  }


  buscarTareasPorPrioridad(prioridad: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (prioridad.trim() === '') {
      this.obtenerTareas(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.tareaService.getTareasByPrioridad(prioridad).subscribe(
        (tareas) => {
          this.tareas = tareas; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.tareas.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron tareas que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener las tareas.',
          });
        }
      );
    }
  }




  buscarTareasPorEstado(estado: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (estado.trim() === '') {
      this.obtenerTareas(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.tareaService.getTareasByEstado(estado).subscribe(
        (tareas) => {
          this.tareas = tareas; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.tareas.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron tareas que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener las tareas.',
          });
        }
      );
    }
  }




  buscarTareasPorResponsable(responsable: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (responsable.trim() === '') {
      this.obtenerTareas(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.tareaService.getTareasByResponsable(responsable).subscribe(
        (tareas) => {
          this.tareas = tareas; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.tareas.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron tareas que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener las tareas.',
          });
        }
      );
    }
  }



  buscarTareasPorProyecto(proyecto: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (proyecto.trim() === '') {
      this.obtenerTareas(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.tareaService.getTareasByProyecto(proyecto).subscribe(
        (tareas) => {
          this.tareas = tareas; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.tareas.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron tareas que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener las tareas.',
          });
        }
      );
    }
  }

  

  cambiarOrden(campo: keyof Tarea): void {
    // Si ya estamos ordenando por el mismo campo, solo cambia la dirección
    if (this.orderBy === campo) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si estamos cambiando el campo de ordenación, establecemos 'ascendente' como predeterminado
      this.orderBy = campo;
      this.orderDirection = 'asc';
    }
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    const table = document.getElementById('tablaTareas'); // Usar el id de la tabla
    
    if (!table) {
      console.error('Tabla no encontrada');
      return;
    }
  
    // Generar la captura de la tabla con html2canvas
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convertir el canvas a imagen
  
      // Obtener las dimensiones del canvas
      const imgWidth = canvas.width * 0.75; // Ajustar el tamaño de la imagen según el ancho
      const imgHeight = canvas.height * 0.75; // Ajustar el tamaño de la imagen según el alto
  
      // Agregar la imagen al PDF con la posición y dimensiones correctas
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // Agregar la imagen al PDF
      doc.save('tareas.pdf'); // Guardar el PDF
    }).catch(err => {
      console.error('Error al generar el PDF:', err);
    });
  } 
}
