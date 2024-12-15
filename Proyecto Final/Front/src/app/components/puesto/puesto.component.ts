import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder, FormGroup y Validators
import { PuestoService } from '../../services/puesto.service';
import { Puesto } from '../../models/puesto.model';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-puestos',
  templateUrl: './puesto.component.html', 
  styleUrls: ['./puesto.component.css'],
})
export class PuestosComponent implements OnInit {
  puestos: Puesto[] = [];
  nuevoPuestoForm: FormGroup; // Propiedad del formulario reactivo
  searchText: string = '';

  puestoEnEdicion: Puesto| null = null;
  isEditing: boolean = false;
  orderBy: keyof Puesto = 'id'; 
  orderDirection: 'asc' | 'desc' = 'asc'; 

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

  buscarPuestosPorNombre(nombre: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (nombre.trim() === '') {
      this.obtenerPuestos(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.puestoService.getPuestosByNombre(nombre).subscribe(
        (puestos) => {
          this.puestos = puestos; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.puestos.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron puestos que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los puestos.',
          });
        }
      );
    }
  }
  

  cambiarOrden(campo: keyof Puesto): void {
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
    const table = document.getElementById('tablaPuestos'); // Usar el id de la tabla
    
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
      doc.save('puestos.pdf'); // Guardar el PDF
    }).catch(err => {
      console.error('Error al generar el PDF:', err);
    });
  } 
}


