import { Component, OnInit } from '@angular/core';
import { Tarea } from 'src/app/models/tarea.model';
import { Responsable } from 'src/app/models/responsable.model';
import { Proyecto } from 'src/app/models/proyecto.model';
import { Departamento } from 'src/app/models/departamento.model';
import { Puesto } from 'src/app/models/puesto.model';
import { TareaService } from 'src/app/services/tarea.service';
import { ResponsableService } from 'src/app/services/responsable.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PuestoService } from 'src/app/services/puesto.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  searchTerm: string = ''; // Término de búsqueda
  datosCombinados: any[] = []; // Datos combinados de todas las entidades
  searchProcessedTerm: string = ''; // Término procesado para la búsqued

  constructor(
    private tareasService: TareaService,
    private responsablesService: ResponsableService,
    private proyectosService: ProyectoService,
    private departamentosService: DepartamentoService,
    private puestosService: PuestoService
  ) {}

  ngOnInit(): void {
    // Usamos forkJoin para manejar múltiples llamadas al servicio de forma simultánea
    forkJoin({
      tareas: this.tareasService.getTareas(),
      responsables: this.responsablesService.getResponsables(),
      proyectos: this.proyectosService.getProyectos(),
      departamentos: this.departamentosService.getDepartamentos(),
      puestos: this.puestosService.getPuestos()
    }).subscribe({
      next: ({ tareas, responsables, proyectos, departamentos, puestos }) => {
        this.datosCombinados = [
          ...responsables.map((responsable: Responsable) => ({
            ...responsable,
            tipo: 'Responsable',
            tareas: tareas.filter((tarea: Tarea) => tarea.responsable?.id === responsable.id)
          })),
          ...tareas.map((tarea: Tarea) => ({
            ...tarea,
            tipo: 'Tarea',
            responsable: responsables.find((responsable: Responsable) => responsable.id === tarea.responsable?.id),
            proyecto: proyectos.find((proyecto: Proyecto) => proyecto.id === tarea.proyecto?.id)
          })),
          ...proyectos.map((proyecto: Proyecto) => ({
            ...proyecto,
            tipo: 'Proyecto'
          })),
          ...departamentos.map((departamento: Departamento) => ({
            ...departamento,
            tipo: 'Departamento'
          })),
          ...puestos.map((puesto: Puesto) => ({
            ...puesto,
            tipo: 'Puesto'
          }))
        ];
      },
      error: error => {
        console.error('Error al cargar datos:', error);
      }
    });
  }

  onSearch(): void {
    console.log(`Buscando: ${this.searchTerm}`);
    
    // Guardamos el término actual para mostrar los resultados
    this.searchProcessedTerm = this.searchTerm;

    // Limpiar el campo de entrada para el usuario, pero mantener el término en memoria
    this.searchTerm = '';
  }  
  
}