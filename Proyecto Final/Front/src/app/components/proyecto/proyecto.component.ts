import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
 
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectoForm!: FormGroup; // Uso del operador '!' para indicar que se inicializa en ngOnInit
  searchText: string = '';
  searchDescripcion: string = '';
  descripcionFiltro: string = '';


  puestoEnEdicion: Proyecto| null = null;
    isEditing: boolean = false;
    orderBy: keyof Proyecto = 'id'; 
    orderDirection: 'asc' | 'desc' = 'asc'; 

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

  buscarProyectosPorNombre(nombre: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (nombre.trim() === '') {
      this.obtenerProyectos(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.proyectoService.getProyectosByNombre(nombre).subscribe(
        (proyectos) => {
          this.proyectos = proyectos; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.proyectos.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron proyectos que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los proyectos.',
          });
        }
      );
    }
  }

  buscarProyectosPorDescripcion(descripcion: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (descripcion.trim() === '') {
      this.obtenerProyectos(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.proyectoService.getProyectosByDescripcion(descripcion).subscribe( 
        (proyectos) => {
          this.proyectos = proyectos; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.proyectos.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron proyectos que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los proyectos.',
          });
        }
      );
    }
  }
  

  cambiarOrden(campo: keyof Proyecto): void {
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
    const table = document.getElementById('tablaProyectos'); // Usar el id de la tabla
    
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
      doc.save('proyectos.pdf'); // Guardar el PDF
    }).catch(err => {
      console.error('Error al generar el PDF:', err);
    });
  } 
}

