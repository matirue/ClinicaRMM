import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  errorMessage = '';
  email: string ='';
  password: string = '';
  emailRegister: string ='';
  passwordRegister: string = '';
  flag: boolean = false;
  
  alias: string = '';
  userAdm: User = new User();
  userAux: User[] = [];
  spinnerChico: boolean = true;
  
 constructor(
   private afAuth: AngularFireAuth,
   private router: Router,
   private authSvc: AuthService,
   private fireSvc: FirebaseService) { 

   }

   
  user: User = new User();

  ngOnInit(): void {
    this.fireSvc.getAllUsers().subscribe((usr)=>{
      sessionStorage.clear();
      this.spinnerChico = false;
      this.userAux = usr;
    });
  }
  capturarHardcodeo(usuario: User){
    
    this.email = usuario.email;
    this.password = usuario.password;

    if(usuario.admin){ this.alias = 'Administrador: ';}
    else if(usuario.especialista){ this.alias = 'Bienvenido Dr. ';}
    else{ this.alias = 'Hola ';}
  }
  
  async login(){
    this.user.email = this.email;
    try {
      //verificar si el usuario esta habilitado o no      
      await this.authSvc.SignIn(this.user,this.password).then((res)=>{
        this.flag = false;
      });      
    } catch (error) {
      
    }
  }

  completarCamposAdmin(){
    this.email = "matiasrue@gmail.com";
    this.password = "admin1234";
  }
  completarDrFacundo(){
    this.email = "dr.balsano@gmail.com";
    this.password = "facundo1234";
  }
  completarDrHous(){
    this.email = "drhouse@gmail.com";
    this.password = "house1234";
  }

  completarPacienteA(){
    this.email = "paciente_a@gmail.com";
    this.password = "test123";
  }
  
  completarPacienteB(){
    this.email = "paciente_b@gmail.com";
    this.password = "test123";
  }
  completarPacienteC(){
    this.email = "paciente_c@gmail.com";
    this.password = "test123";
  }

}
