import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  nuevoProyecto: Proyecto = new Proyecto();

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.obtenerProyectos();
    console.log(this.proyectos);
  }

  obtenerProyectos(): void {
    this.proyectoService.getProyectos().subscribe(proyectos => {
      this.proyectos = proyectos;
    });
  }

  agregarProyecto(): void {
    if (this.nuevoProyecto.id) {
      this.proyectoService.updateProyecto(this.nuevoProyecto).subscribe(() => {
        this.obtenerProyectos();
        this.nuevoProyecto = new Proyecto();
      }, error => {
        console.error('Error al actualizar el proyecto:', error);
      });
    } else {
      console.log(this.nuevoProyecto)
      this.proyectoService.createProyecto(this.nuevoProyecto).subscribe(() => {
        this.obtenerProyectos();
        this.nuevoProyecto = new Proyecto();
      }, error => {
        console.error('Error al agregar el proyecto:', error);
      });
    }
  }

  eliminarProyecto(id: number | undefined): void {
    if (id !== undefined) {
      this.proyectoService.deleteProyecto(id).subscribe(() => {
        this.proyectos = this.proyectos.filter(proyecto => proyecto.id !== id);
      }, error => {
        console.error('Error al eliminar el proyecto:', error);
      });
    }
  }

  updateProyecto(proyecto: Proyecto): void {
    this.nuevoProyecto = { ...proyecto };
  }
}
