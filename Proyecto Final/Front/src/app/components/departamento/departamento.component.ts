import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
 
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
  orderBy: keyof Departamento = 'id'; 
  orderDirection: 'asc' | 'desc' = 'asc'; 

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

  buscarDepartamentosPorNombre(nombre: string): void {
    this.page = 1; // Reinicia la página a la primera
    if (nombre.trim() === '') {
      this.obtenerDepartamentos(); // Si no hay texto de búsqueda, obtiene todos los departamentos
    } else {
      this.departamentoService.getDepartamentosByNombre(nombre).subscribe(
        (departamentos) => {
          this.departamentos = departamentos; // Aquí se actualiza con los departamentos filtrados desde el backend
          if (this.departamentos.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron departamentos que coincidan con la búsqueda.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los departamentos.',
          });
        }
      );
    }
  }
  

  cambiarOrden(campo: keyof Departamento): void {
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
    const table = document.getElementById('tablaDepartamentos'); // Usar el id de la tabla
    
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
      doc.save('departamentos.pdf'); // Guardar el PDF
    }).catch(err => {
      console.error('Error al generar el PDF:', err);
    });
  }
  
  

}
