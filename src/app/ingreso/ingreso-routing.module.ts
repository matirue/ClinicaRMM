import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { BienvenidoComponent } from '../pages/bienvenido/bienvenido.component';



const routes: Routes = [
  { 
    path: 'bienvenido', 
    component: BienvenidoComponent
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'registro', 
    component: RegistroComponent  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoRoutingModule { }
