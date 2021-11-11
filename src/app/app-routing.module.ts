import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './componentes/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { AltaTurnoComponent } from './componentes/turnos/alta-turno/alta-turno.component';
import { MiperfilComponent } from './componentes/miperfil/miperfil.component';
import { MostrarturnosComponent } from './componentes/turnos/mostrarturnos/mostrarturnos.component';
import { PacienteAdminGuardGuard } from './guards/paciente-admin-guard.guard';
import { MisturnosComponent } from './componentes/turnos/misturnos/misturnos.component';
import { HistPacientesComponent } from './componentes/hist-pacientes/hist-pacientes.component';
import { EspecialistaGuard } from './guards/especialista.guard';

const routes: Routes = [
  { 
    path: '', 
    component: BienvenidoComponent
  },
  { 
    path: 'administrador', 
    component: AdminComponent, 
    canActivate:[AdminGuard] 
  },
  { 
    path: 'perfil', 
    component: MiperfilComponent, 
  },
  { 
    path: 'mostrarturnos', 
    component: MostrarturnosComponent, 
    canActivate:[AdminGuard]
  },
  { 
    path: 'turnos', component: MisturnosComponent
  },  
  { 
    path: 'altaTurno', 
    component: AltaTurnoComponent,
    canActivate: [PacienteAdminGuardGuard]
  },
  { 
    path: 'pacientes', 
    component: HistPacientesComponent,
    canActivate: [EspecialistaGuard]
  },
  { 
    path: 'ingreso', 
    loadChildren: () => import('./ingreso/ingreso.module').then(m => m.IngresoModule),
  },
  { 
    path: 'navbar', 
    loadChildren: () => import('./navbar/navbar.module').then(m => m.NavbarModule),  
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
