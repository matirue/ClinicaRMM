import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Especialidad } from '../clases/especialidad';
import { FirebaseService } from '../services/firebase.service';

@Directive({
  selector: '[appEnter]'
})

/** Directiva que dectecta el evento enter al agregar una especialidad usado en el register */
export class EnterDirective {
  @Input()appEnter = "";
  especialidad: Especialidad  = new Especialidad();

  constructor(
    private el: ElementRef,
    private fireSvc:FirebaseService
  ) { }


  @HostListener('window:keydown',['$event']) onKeyDown(event: KeyboardEvent){
    if(event.key == 'Enter'){
      console.log("presiono enter");
      console.log(this.appEnter);
      if(this.appEnter != ""){
        this.especialidad.nombre = this.appEnter;
  
        this.fireSvc.AddEspecialidades(this.especialidad)

      }
    }
    else{
      // return false;
    }
    console.info("evento",event);
  }
  submit(){
    return this.appEnter;
  }
}
