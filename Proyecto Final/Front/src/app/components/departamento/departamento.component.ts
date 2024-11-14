import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];
  nuevoDepartamento: Departamento = new Departamento();

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.obtenerDepartamentos();
  }

  obtenerDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });
  }

  agregarDepartamento(): void {
    if (this.nuevoDepartamento.id) {
      this.departamentoService.updateDepartamento(this.nuevoDepartamento).subscribe(() => {
        this.obtenerDepartamentos();
        this.nuevoDepartamento = new Departamento();
      }, error => {
        console.error('Error al actualizar el departamento:', error);
      });
    } else {
      this.departamentoService.createDepartamento(this.nuevoDepartamento).subscribe(() => {
        this.obtenerDepartamentos();
        this.nuevoDepartamento = new Departamento();
      }, error => {
        console.error('Error al agregar el departamento:', error);
      });
    }
  }

  eliminarDepartamento(id: number | undefined): void {
    if (id !== undefined) {
      this.departamentoService.deleteDepartamento(id).subscribe(() => {
        this.departamentos = this.departamentos.filter(departamento => departamento.id !== id);
      }, error => {
        console.error('Error al eliminar el departamento:', error);
      });
    }
  }

  updateDepartamento(departamento: Departamento): void {
    this.nuevoDepartamento = { ...departamento };
  }
}
