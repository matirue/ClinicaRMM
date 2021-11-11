import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EstadoTurno } from 'src/app/clases/estado-turno';
import { Historia } from 'src/app/clases/historia';
import { Turnos } from 'src/app/clases/turnos';
import { User } from 'src/app/clases/user';
import { AlertasService } from 'src/app/services/alertas.service';
import { FirebaseService} from 'src/app/services/firebase.service';

@Component({
  selector: 'app-hist-pacientes',
  templateUrl: './hist-pacientes.component.html',
  styleUrls: ['./hist-pacientes.component.css']
})
export class HistPacientesComponent implements OnInit {

  
  @Input()turnos: Turnos[];
  usuarioLogueado: User = new User();
  estados: EstadoTurno[] = [];
  historias: Historia[] = [];


  constructor(
    private fireSvc: FirebaseService,
    private alertas: AlertasService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    
    this.fireSvc.getAllEstados().subscribe(estados=>{
      this.estados = estados;
    });
    this.fireSvc.getAllHistorias().subscribe(historias=>{
      historias.forEach(historia => {

        if(historia.turno.especialista.uid == this.usuarioLogueado.uid){
          this.historias.push(historia);
        }
      });
    });
  }

}
