import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lessThanValidatorExtension } from '@rxweb/reactive-form-validators/validators-extension';
import { User } from 'src/app/clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertasService } from 'src/app/services/alertas.service';
import { BajaUsuario } from 'src/app/clases/bajaUsuario';
import { Historia } from 'src/app/clases/historia';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";
import { Turnos } from 'src/app/clases/turnos';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  usuariosAAprobar: User[];
  usuariosEspecialistas: User[];
  
  habilitado: boolean;
  mostrarListado: boolean = false;

  mensajeDeshabilitado:string = 'Habilitar';
  mensajeHabilitado:string= 'Deshabilitar';
  mensaje = 'Listado de especialistas pendientes de aprobación';

  checked:boolean = false;
  mostrarBaja:boolean = false;

  bajaUser:BajaUsuario = new BajaUsuario();
  historias: Historia[] = [];
  turnosHistorias: Turnos[] = [];

  flag:boolean = false;

  formGroupCheck!: FormGroup;

  // arrayExcelUsuario =  [];
  constructor(
    private authSvc: AuthService,
    private fireSvc: FirebaseService,
    private fb:FormBuilder,
    private spinner: NgxSpinnerService,
    private alertas: AlertasService,
    private excel: ExportExcelService
  ) { 
    this.usuariosAAprobar = [];
    this.usuariosEspecialistas = [];
    
    this.mostrarHistoriales = false;
  }



  ngOnInit(): void {


    this.fireSvc.getAllHistorias().subscribe(historias=>{

      this.historias = historias;
      this.flag = false;
      console.log("history>>>",this.historias);
    })

    this.fireSvc.getAllTurnos().subscribe(auxTurnosHistorias => {
      this.turnosHistorias = auxTurnosHistorias;
      this.flag = false;
      console.log("TURNOS history>>>",this.turnosHistorias);

      
    })

    


    this.fireSvc.getAllUsers().subscribe((usuarios)=>{

      // this.arrayExcelUsuario = <any>usuarios;

      this.usuariosEspecialistas = [];
      usuarios.forEach(usuario => {
        // console.log(usuario);
        // this.spinner = false;
        
        this.mensaje = 'Listado de especialistas pendientes de aprobación';
        if(usuario.especialista){
          this.usuariosEspecialistas.push(JSON.parse(JSON.stringify(usuario)));
          if(!usuario.aprobadoPorAdmin){
            
            this.mostrarBaja = false;
            
            this.habilitado=false;
            this.mensajeHabilitado = "Deshabilitar";
            this.mensajeDeshabilitado = "Habilitar";
            this.mostrarListado = true;
            // console.log("este usuario no esta aprobado por admin "+usuario.email);
  
          }
          else{
            this.mostrarBaja = true;
            this.habilitado = true;
            this.mensajeHabilitado = "Deshabilitar";
            this.mensajeDeshabilitado = "Habilitar";

            if(!this.mostrarListado){
                this.mensaje = 'No se encontraron usuarios para aprobar'
            }
  
          }
        }
      });
    });

    this.formGroupCheck = this.fb.group({
      'check': ['',[Validators.required]]});
  }

  mostrarHistoriales: boolean = false;
  mostrarHistorial(){
    this.mostrarHistoriales = true;
  }
  ocultar(){
    this.mostrarHistoriales = false;
  }

  verificarChangeCheck(usuario: User,event){
      // console.log(event.target.checked);
      usuario.aprobadoPorAdmin = event.target.checked;
      this.habilitar(usuario)
    // this.habilitar(usuario,index);
  }


  habilitar(usuario:User){
    this.usuariosAAprobar = [];
    usuario.aprobadoPorAdmin = true;
    this.habilitado = true;
    this.fireSvc.updateUsuario(usuario).then(()=>{
      if(this.usuariosAAprobar.length == 0){
        this.mostrarListado = false;
      }
      
    });

  }



  // deshabilitar(usuario:User, index:number){
    deshabilitar(usuario:User){
    this.usuariosAAprobar = [];
    this.habilitado = false;
    usuario.aprobadoPorAdmin = false;
    if(!usuario.aprobadoPorAdmin){
      this.mensajeHabilitado = "Habilitar";
    }
    this.fireSvc.updateUsuario(usuario).then(()=>{
      if(this.usuariosAAprobar.length == 0){
        this.mostrarListado = false;
      }
      
    });
  }


  bajaUsuario(usuario: User){
    this.mostrarBaja = false;
    for (let i = 0; i < this.usuariosEspecialistas.length; i++) {
      if(this.usuariosEspecialistas[i] == usuario){
        this.alertas.mostraAlertaInput('Baja de usuario','Ingrese motivo de la baja').then(texto=>{
          console.log(texto);
          this.usuariosEspecialistas[i].aprobadoPorAdmin = false;
          this.usuariosEspecialistas[i].baja = true;
          this.bajaUser.usuario = this.usuariosEspecialistas[i];
          this.bajaUser.fecha = this.bajaUser.obtenerFechaHora();
          this.bajaUser.motivo = texto;
          this.fireSvc.addBaja(this.bajaUser,this.usuariosEspecialistas[i]);
        });
        
      }
      
    }
  }

}
