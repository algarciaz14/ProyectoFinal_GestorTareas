import { Component, OnInit } from '@angular/core';
import { PuestoService } from '../../services/puesto.service';
import { Puesto } from '../../models/puesto.model';

@Component({
  selector: 'app-puestos',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.css']
})
export class PuestosComponent implements OnInit {
  puestos: Puesto[] = [];
  nuevoPuesto: Puesto = new Puesto();

  constructor(private puestoService: PuestoService) {}

  ngOnInit(): void {
    this.obtenerPuestos();
  }

  obtenerPuestos(): void {
    this.puestoService.getPuestos().subscribe(puestos => {
      this.puestos = puestos;
    });
  }

  agregarPuesto(): void {
    if (this.nuevoPuesto.id) {
      this.puestoService.updatePuesto(this.nuevoPuesto).subscribe(() => {
        this.obtenerPuestos();
        this.nuevoPuesto = new Puesto();
      }, error => {
        console.error('Error al actualizar el puesto:', error);
      });
    } else {
      this.puestoService.createPuesto(this.nuevoPuesto).subscribe(() => {
        this.obtenerPuestos();
        this.nuevoPuesto = new Puesto();
      }, error => {
        console.error('Error al agregar el puesto:', error);
      });
    }
  }

  eliminarPuesto(id: number | undefined): void {
    if (id !== undefined) {
      this.puestoService.deletePuesto(id).subscribe(() => {
        this.puestos = this.puestos.filter(puesto => puesto.id !== id);
      }, error => {
        console.error('Error al eliminar el puesto:', error);
      });
    }
  }

  updatePuesto(puesto: Puesto): void {
    this.nuevoPuesto = { ...puesto };
  }
}
