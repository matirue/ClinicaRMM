import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Historia } from 'src/app/clases/historia';
import { Turnos } from 'src/app/clases/turnos';
import { AlertasService } from 'src/app/services/alertas.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input()turnoSeleccionado: Turnos;

  altura: number;
  peso: number;
  temp: number;
  presion: number;
  clave1: string;
  valor1: number;
  clave2: string;
  valor2: number;  
  
  public formGroup!: FormGroup;
  
  constructor(
    private fb:FormBuilder,
    private fire: FirebaseService,
    private alerta: AlertasService,
    private spinner: NgxSpinnerService,
    private router:Router
    ) { }

  ngOnInit(): void {
    
    
  this.formGroup = this.fb.group({
      'altura': ['',[Validators.required,Validators.min(0.50)]],
      'peso': ['',Validators.required],
      'temperatura': ['',Validators.required],
      'presion': ['',Validators.required],
      'clave': ['',Validators.required],
      'valor': ['',Validators.required],
      'clave2': ['',Validators.required],
      'valor2': ['',Validators.required],      
    });
  }


  enviarHistoria(){
    this.spinner.show();
    let historia:Historia = this.formGroup.getRawValue();
    // historia.turno = this.turnoSeleccionado;
    this.turnoSeleccionado.historia = historia;
    this.fire.updateTurno(this.turnoSeleccionado);
    console.log("historia>>>> "+historia);
    
    this.fire.addHistoria(historia).then(a=>{
      console.log(a);
      
      this.fire.updateHistorias(historia);
      this.spinner.hide();
      this.router.navigate(['']);
      this.alerta.mostraAlertaSimpleSuccess('Historial cargado exitosamente','Confirmación')
    });

  }

}
