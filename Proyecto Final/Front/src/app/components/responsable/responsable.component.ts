import { Component, OnInit } from '@angular/core';
import { ResponsableService } from '../../services/responsable.service';
import { Responsable } from '../../models/responsable.model';
import { DepartamentoService } from '../../services/departamento.service';
import { PuestoService } from '../../services/puesto.service';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsablesComponent implements OnInit {
  responsables: Responsable[] = [];
  nuevoResponsable: Responsable = new Responsable();
  departamentos: any[] = [];
  puestos: any[] = [];

  constructor(
    private responsableService: ResponsableService,
    private departamentosService: DepartamentoService,
    private puestosService: PuestoService
  ) {}

  ngOnInit(): void {
    this.obtenerResponsables();
    this.cargarDepartamentosYPuestos();
  }

  cargarDepartamentosYPuestos(): void {
    this.departamentosService.getDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });

    this.puestosService.getPuestos().subscribe(puestos => {
      this.puestos = puestos;
    });
  }

  obtenerResponsables(): void {
    this.responsableService.getResponsables().subscribe(responsables => {
      this.responsables = responsables;
    });
  }

  agregarResponsable(): void {
    if (this.nuevoResponsable.id) {
      this.responsableService.updateResponsable(this.nuevoResponsable).subscribe(() => {
        this.obtenerResponsables();
        this.nuevoResponsable = new Responsable();
      }, error => {
        console.error('Error al actualizar el responsable:', error);
      });
    } else {
      this.responsableService.createResponsable(this.nuevoResponsable).subscribe(() => {
        this.obtenerResponsables();
        this.nuevoResponsable = new Responsable();
      }, error => {
        console.error('Error al agregar el responsable:', error);
      });
    }
  }

  eliminarResponsable(id: number | undefined): void {
    if (id !== undefined) {
      this.responsableService.deleteResponsable(id).subscribe(() => {
        this.responsables = this.responsables.filter(responsable => responsable.id !== id);
      }, error => {
        console.error('Error al eliminar el responsable:', error);
      });
    }
  }

  updateResponsable(responsable: Responsable): void {
    this.nuevoResponsable = { ...responsable };
  }
}
