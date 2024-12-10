import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DepartamentosComponent } from './components/departamento/departamento.component';
import { ProyectosComponent } from './components/proyecto/proyecto.component';
import { PuestosComponent } from './components/puesto/puesto.component';
import { ResponsablesComponent } from './components/responsable/responsable.component';

import { TareasComponent } from './components/tareas/tareas.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TareaFilterPipe } from './filters/tarea-filter.pipe';
import { ResponsableFilterPipe } from './filters/responsable-filter.pipe';
import { ProyectoFilterPipe } from './filters/proyecto-filter.pipe';
import { PuestoFilterPipe } from './filters/puesto-filter.pipe';
import { DepartamentoFilterPipe } from './filters/departamento-filter.pipe';
import { BusquedaGeneralPipe } from './filters/busqueda-general.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    DepartamentosComponent,
    ProyectosComponent,
    PuestosComponent,
    ResponsablesComponent,
    TareasComponent,
    InicioComponent,
    TareaFilterPipe,
    ResponsableFilterPipe,
    ProyectoFilterPipe,
    PuestoFilterPipe,
    DepartamentoFilterPipe,
    BusquedaGeneralPipe 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

