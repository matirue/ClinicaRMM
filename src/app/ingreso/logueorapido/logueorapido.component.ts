import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-logueorapido',
  templateUrl: './logueorapido.component.html',
  styleUrls: ['./logueorapido.component.css']
})
export class LogueorapidoComponent implements OnInit {

  @Input()usuarios: any;
  admin: User = new User();
  @Output()eventoLogueoUsuario:EventEmitter<any> = new EventEmitter<any>();
  // spinner:boolean = true;
  constructor() { }

  ngOnInit(): void {
    // console.log(this.usuarios);
    this.usuarios.forEach(element => {
      if(element.admin){
        this.admin = element;
      }
    });
  }
  loguear(usuario: User){
    this.eventoLogueoUsuario.emit(usuario);
  }

}
