import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Turnoesp, User } from 'src/app/clases/user';

@Component({
  selector: 'app-listarturnos',
  templateUrl: './listarturnos.component.html',
  styleUrls: ['./listarturnos.component.css']
})
export class ListarturnosComponent implements OnInit {
  
  @Input()seleccioneMedico:boolean;
  @Input()especialidadSeleccionada: string;
  @Input()listadoTurnos: Turnoesp[];
  @Output()eventoSeleccionHorario: EventEmitter<any>  = new EventEmitter();
  @Input()medico: User;

  mostrar:boolean = false;
  auxfecha:string;

  constructor() { }

  ngOnInit(): void {
    this.listadoTurnos.forEach(turno => {
      // console.log(turno.especialidad);
      this.auxfecha = turno.fecha;
      turno.horarios.forEach(hora => {
        console.log(hora);
      });
    });
  }

  seleccionFecha(fecha:string){
    

    if(fecha == this.auxfecha){
      this.mostrar = true;
    }
  }

  seleccionTurno(fecha:string, hora: string){
    // console.log(fecha + hora)
    let objAux = {
      fecha: fecha,
      hora: hora,
      
    }
    this.eventoSeleccionHorario.emit(objAux);
  }
  

}
