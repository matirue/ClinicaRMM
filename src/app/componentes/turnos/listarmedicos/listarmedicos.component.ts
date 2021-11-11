import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { isEmpty } from 'rxjs/operators';
import { Especialidad } from 'src/app/clases/especialidad';
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-listarmedicos',
  templateUrl: './listarmedicos.component.html',
  styleUrls: ['./listarmedicos.component.css']
})
export class ListarmedicosComponent implements OnInit {

  @Input()especialistas: any;
  espAux = [];
  ocultar:boolean;
  
  @Output()eventoSeleccionMedico: EventEmitter<any>  = new EventEmitter();
  @Output()eventoSeleccionEspecialidad: EventEmitter<any>  = new EventEmitter();
  constructor() { 
    
  }

  ngOnInit(): void {
    console.log("esp selec>>>"+this.especialistas);
    
  }

  seleccionMedico(medico:User,especialidad?:string){
    // console.log(especialidad);
    if(!especialidad){
      
    }
    console.log(medico);
    this.eventoSeleccionEspecialidad.emit(especialidad)
    this.eventoSeleccionMedico.emit(medico);

  }

}
