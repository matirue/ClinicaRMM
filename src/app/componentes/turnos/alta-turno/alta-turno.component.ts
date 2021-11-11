import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Especialidad } from 'src/app/clases/especialidad';
import { Turnos } from 'src/app/clases/turnos';
import { Horarios, User } from 'src/app/clases/user';
import { AlertasService } from 'src/app/services/alertas.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

@Component({
  selector: 'app-alta-turno',
  templateUrl: './alta-turno.component.html',
  styleUrls: ['./alta-turno.component.css']
})
export class AltaTurnoComponent implements OnInit {
  turno:Turnos = new Turnos();
  especialidades= [];
  especialistas= [];
  pacientes= [];
  espAux = [];

  mostrarTurnos:boolean = false;
  medicosSeleccionados:User[]=[];
  medicoSeleccionado:User;
  usuarioLogueado:User;
  especialidadSeleccionada:any;
  public isCollapsed: boolean[] = [];
  muestroEspecialidades:boolean = false;
  muestroMedicos:boolean = false;

  pacienteSeleccionado:User;
  mostrarMensajeSeleccion: boolean = false;
  mostrarMensajePaciente: boolean = false;
  mostrarBotonConfirmar: boolean = false;

  seleccionePaciente: boolean = false;
  medicoString: string = 'Medico';
  seleccioneMedico: boolean= false;
  seleccioneEspecialidad: boolean= false;
  listadoTurnos: any;

  filtroEspecialidad:string = 'todos';

  ocultar:boolean = true;

  constructor(
    private fireSvc: FirebaseService,
    private alerta: AlertasService,
    private router: Router    
  ) {
   }
   
  ngOnInit(): void {

    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    
    
    this.fireSvc.getEspecialidades().subscribe((especialidades)=>{
      especialidades.forEach(element => {
        this.especialidades.push(element);
        this.muestroEspecialidades = true;
      });
      
    });
    this.fireSvc.getAllUsers().subscribe((usuarios)=>{
      // console.log(this.turno);
      usuarios.forEach(usr => {
        if(usr.especialista){
          if(usr.disponibilidadEsp != null){
            if(usr.disponibilidadEsp.length != 0){
              this.espAux.push(JSON.parse(JSON.stringify(usr)));
              this.especialistas.push(JSON.parse(JSON.stringify(usr)));
            }
          }
        }
        if(usr.paciente == true){
          this.pacientes.push(JSON.parse(JSON.stringify(usr)));
        }
      });
      
    });
  }
  capturarEsp(especialidad:string){
    
    this.medicoSeleccionado = new User();
    this.pacienteSeleccionado = new User();
    this.turno = new Turnos();
    this.mostrarMensajeSeleccion = false;
    this.mostrarMensajePaciente = false;
    this.muestroMedicos = false;
    // console.log(this.medicoString);

    this.especialidadSeleccionada = especialidad;
    // console.log(especialidad)
   this.mostrarTurnos = false;
   this.muestroMedicos = true;
    this.medicosSeleccionados.splice(0);

   this.especialistas.forEach((espEsp: User) => {
     
    if(espEsp.disponibilidadEsp){    
     espEsp.disponibilidadEsp.forEach(esp => {
        //  console.log(esp)
        esp.horarios.forEach(hora => {
          // console.log(hora);
          if(hora.disponible){
  
            if(esp.especialidad == especialidad){
              
              this.muestroMedicos = true;
              if(this.medicosSeleccionados.length > 0){
                this.medicosSeleccionados.forEach(element => {
                  if(element.uid === espEsp.uid){
                    console.log("element.uid === espEsp.uid");
                  }
                  else{
                    this.medicosSeleccionados.push(espEsp);  
                   }
                  
                });
              }
              else{
                this.medicosSeleccionados.push(espEsp);    
              }
            }
          }
        });
         
     });
    }
   });
  }


  capturarMed(medico: User){
    this.mostrarTurnos = true;
    this.mostrarMensajeSeleccion = false;
    this.mostrarMensajePaciente = false; 
   this.medicoSeleccionado = medico;   
  }


  tomarTurno(fecha:string, horario: string,medico: User){
  
    if(this.usuarioLogueado.admin){
      this.turno.paciente = this.pacienteSeleccionado;
    }
    else{
      this.turno.paciente = this.usuarioLogueado;
    }
    
   this.mostrarMensajeSeleccion = true;
    this.turno.especialidad = this.especialidadSeleccionada.especialidad;
    this.turno.fecha = fecha;
    this.turno.hora = horario;
    for (let i = 0; i < this.medicoSeleccionado.disponibilidadEsp.length; i++) {
          const element = this.medicoSeleccionado.disponibilidadEsp[i];
         console.log(element);
         
        if(this.turno.fecha == this.medicoSeleccionado.disponibilidadEsp[i].fecha){
            for (let j = 0; j < this.medicoSeleccionado.disponibilidadEsp[i].horarios.length; j++) {
              
              if(this.turno.hora == this.medicoSeleccionado.disponibilidadEsp[i].horarios[j].hora &&
                this.medicoSeleccionado.disponibilidadEsp[i].horarios[j].disponible == true){
                console.log("horario ok");
                console.log(this.medicoSeleccionado.disponibilidadEsp[i].horarios);
                this.medicoSeleccionado.disponibilidadEsp[i].horarios[j].disponible = false;
                medico = this.medicoSeleccionado;
              }
          }
        }
    }
    // console.log(medico.disponibilidadEsp);
    
    this.turno.especialista = JSON.parse(JSON.stringify(medico));;
    this.turno.especialista.disponibilidadEsp = null;

    this.fireSvc.updateUsuario(this.medicoSeleccionado);
    let asd = this.fireSvc.addTurno(this.turno);
    asd.then(asd=>{
      // console.log(asd);
    });
    this.alerta.mostraAlertaSimpleSuccess('Turno Confirmado reservado, par el dia: ' + this.turno.fecha + 
                                              " a las "+ this.turno.hora,
                                              'Turno confirmado');
    this.router.navigate(['/']);
  }


  seleccionPaciente(paciente:User){
   this.mostrarMensajePaciente = true;
   this.seleccionePaciente = true;
    this.pacienteSeleccionado = paciente;
    // console.log(this.pacienteSeleccionado);
  }


  confirmarTurno(){
    if(this.usuarioLogueado.admin){
      this.turno.paciente = this.pacienteSeleccionado;
    }
    else if(this.usuarioLogueado.paciente){
     this.turno.paciente = this.usuarioLogueado;
    }
    if(this.medicosSeleccionados != null){  
        this.medicoSeleccionado.disponibilidadEsp.forEach(turno => {
          turno.horarios.forEach(element => {
            
          });
        }); 

          this.turno.especialista.disponibilidadEsp = null;
          this.turno.especialista.descripcion = null;
         
    }
  }
  

  chequearEspecialista(){
    this.especialistas.forEach((esp:User) => {
      esp.descripcion.forEach(especialidadEspecialista => {
        this.especialidades.forEach(especialidadesCargadas => {
            if(especialidadEspecialista == especialidadesCargadas.nombre){
                console.log(especialidadEspecialista);
            }
          });
          
        });
    });

  }

  public beforeChange($event: NgbPanelChangeEvent) {
    // console.log($event)
    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  //SELECCION DE UN MEDICO
  capturarMedicoSeleccion(e){
    
    if(this.usuarioLogueado.admin){
      this.seleccionePaciente = false
    }
    else{
      this.seleccionePaciente = true;
    }
    this.medicoSeleccionado = e;
    // console.log(this.medicoSeleccionado);
    
    this.seleccioneMedico = true;
    this.listadoTurnos = this.medicoSeleccionado.disponibilidadEsp;
  }

  capturarEspSeleccionada(e){
    this.especialidadSeleccionada = e;

    this.seleccioneEspecialidad = true;
    
  }
  capturarEventoTomarTurno(e){
    // console.log(this.medicoSeleccionado)
    this.tomarTurno(e.fecha,e.hora,this.medicoSeleccionado);
  }
  capturarSeleccionPaciente(e){
    this.seleccionePaciente = true;
    this.pacienteSeleccionado = e;
  }
  filtrarEspecialidad(especialidad: string){
    this.filtroEspecialidad = especialidad;
    // console.log(this.filtroEspecialidad);
    this.filtrarMedico();
  }
  filtrarMedico(){
    this.seleccioneMedico = false;
    let arr = [];
    if(this.espAux.length != 0){
      
      if(this.filtroEspecialidad == 'todos'){
          this.espAux = this.especialistas;
          
          // console.log(this.espAux)
      }
      else{
        
        this.especialistas.forEach(esp => {
          // console.log(esp)

          esp.descripcion.forEach(descr => {
            // console.log(descr)
            if(descr == this.filtroEspecialidad){
              this.ocultar = false;
              arr.push(esp);
            }
          });
        });
        if(arr.length == 0){
          this.alerta.mostraAlertaSimple('Lo sentimos, todos nuestros especialistas no se encuentran disponibles en estos momentos','Aviso');
        }
        else{

          this.espAux = arr;
        }
      }
    }
    else{
      this.espAux = [];
    }
  }
}

