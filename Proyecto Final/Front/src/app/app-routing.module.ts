import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasComponent } from './components/tareas/tareas.component';
import { ResponsablesComponent } from './components/responsable/responsable.component';
import { ProyectosComponent } from './components/proyecto/proyecto.component';
import { DepartamentosComponent } from './components/departamento/departamento.component';
import { PuestosComponent } from './components/puesto/puesto.component';
import { InicioComponent } from './components/inicio/inicio.component'; 

const routes: Routes = [
  { path: '', component: InicioComponent }, // Ruta raíz que muestra el componente Inicio
  { path: 'tareas', component: TareasComponent },
  { path: 'responsables', component: ResponsablesComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'puestos', component: PuestosComponent },
  { path: '**', redirectTo: '' } // Redireccionar a inicio para rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
