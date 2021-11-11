import { toTypeScript } from '@angular/compiler';
import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Especialidad } from 'src/app/clases/especialidad';
import { EstadoTurno } from 'src/app/clases/estado-turno';
import { Historia } from 'src/app/clases/historia';
import { Estados, Turnos } from 'src/app/clases/turnos';
import { Horarios, Turnoesp, User } from 'src/app/clases/user';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertasService } from 'src/app/services/alertas.service';
import * as CanvasJS from './../../canvasjs.min';
import * as html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as $ from "jquery";
import { Chart } from 'angular-highcharts';
import { ChartsService } from 'src/app/services/charts.service';
import { Axis, ChartOptions, PointOptionsType, SeriesOptionsType } from 'highcharts';
import { Point } from 'angular-highcharts/lib/chart';
import { Logs } from 'src/app/clases/logs';
import { first } from 'rxjs/operators';
import Canvg from 'canvg';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {

  @ViewChild('chartContainer') chartContainer: ElementRef;
  @ViewChild('chartContainerTurnosDia') chartContainerTurnosDia: ElementRef;
  @ViewChild('chart0') chart0: ElementRef;
  @ViewChild('chart1') chart1: ElementRef;
  @ViewChild('chart1Aux') chart1Aux: ElementRef;
  @ViewChild('chart2') chart2: ElementRef;
  @ViewChild('chart3') chart3: ElementRef;
  @ViewChild('chart4') chart4: ElementRef;
  
  usuarioLogueado: User;
  disponibilidad: string;
  mostrarHorario: boolean;
  especialidad: string;
  disp:Turnoesp[] = [];
  hoy: Date = new Date(Date.now());
  diaSeleccionado: Date = new Date();
  fechaSeleccionadaPicker = 'xx/xx/xxxx';
  fechaSeleccionadaPickerRealizado = 'xx/xx/xxxx';
  fechaSeleccionada = this.hoy.getFullYear()+'-'+(this.hoy.getMonth()+1)+'-'+this.hoy.getDate()+'T00:00:00';
  minimo = this.hoy.getFullYear()+'-0'+(this.hoy.getMonth()+1)+'-'+(this.hoy.getDate());
  horaSeleccionada: string = '';
  maximo = '2021-12-31';
  arrayHorarios:any[] = [];
  horariosAElegir: any[] = [];
  sliderHoraComienzo: number;
  sliderCantTurnos: number;
  sliderDiaSemana: number = 1;
  sliderDiaSemanaString: string = 'Lunes';
  maxSliderTurno: number = 22;
  maxSliderHora: number = 18;
  turnoAux: Turnoesp;
  historia: Historia[]=[];
  flag: boolean = false;
  seleccioneDia: boolean = false;
  seleccioneHora: boolean = false;
  arrayExcelTurno =  [];

  verHistPaciente:boolean = false;
  verHistEspecialista:boolean = false;

  estados:EstadoTurno[] = []
  estadosAdmin:EstadoTurno[] = []
  turnos: Turnos[] = [];
  especialidades: Especialidad[] = [];
  chartCantPorDia: Chart;
  chartEspPorTurno: Chart;
  chartTurnoPorMedicoFecha: Chart;
  chartTurnoPorMedicoFechaFinalizado: Chart;
  seleccioneFechaSolicitado:boolean = false;
  seleccioneFechaFinalizado:boolean = false;
  usuarios: User[] = [];

  logs:Logs[] = [];

  constructor(
    private fireSvc: FirebaseService,
    private spinner: NgxSpinnerService,
    private alertas: AlertasService,
    private config: NgbCarouselConfig,
    private excel: ExportExcelService,
    private pdf: ExportarPdfService,

  ) {
    config.interval = 2500;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    
    // console.log(this.sliderHoraComienzo);
    this.verHistPaciente = false;
    this.verHistEspecialista = false;

    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = false;
   }

   CerrarHistorial(){
     
    this.verHistPaciente = false;
    this.verHistEspecialista = false;
   }

   verHistorialPac(){
    this.verHistPaciente = true;
    this.verHistEspecialista = false;
   }

   verHistorialEsp(){
     this.verHistEspecialista = true;
     this.verHistPaciente = false;
   }

  calcularSlider(){
    var date = new Date(this.hoy.getTime());
    date.setDate(date.getDate() + (this.sliderDiaSemana +-1) - (date.getDay() + 6) % 7);

    let fecha = date.getDate() + "/"+ (date.getMonth()+1) + "/" + date.getFullYear();
    this.fechaSeleccionada = fecha;

    if(this.sliderDiaSemana == 1){
      this.sliderDiaSemanaString = 'Lunes';
      this.maxSliderHora = 18;

    }
    if(this.sliderDiaSemana == 2){
      this.sliderDiaSemanaString = 'Martes';
      this.maxSliderHora = 18;


    }
    if(this.sliderDiaSemana == 3){
      this.sliderDiaSemanaString = 'Miercoles';
      this.maxSliderHora = 18;

    }
    if(this.sliderDiaSemana == 4){
      this.sliderDiaSemanaString = 'Jueves';
      this.maxSliderHora = 18;

    }
    if(this.sliderDiaSemana == 5){
      this.sliderDiaSemanaString = 'Viernes';
      this.maxSliderHora = 18;
    }
    if(this.sliderDiaSemana == 6){
      this.sliderDiaSemanaString = 'Sabado';
      this.maxSliderHora = 14;
    }
    // console.log(this.sliderHoraComienzo);
    switch(this.sliderHoraComienzo){
      case 19:
        this.maxSliderTurno = 0;

        break;
      case 18:
        this.maxSliderTurno = 2;

        break;
      case 17:
        this.maxSliderTurno = 4;

        break;
      case 16:
        this.maxSliderTurno = 6;

        break;
      case 15:
        this.maxSliderTurno = 8;
        break;
      case 14:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 0;

        }
        else{

          this.maxSliderTurno = 10;
        }
        break;
      case 13:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 2;

        }
        else{

          this.maxSliderTurno = 12;
        }
        break;
      case 12:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 4;

        }
        else{

          this.maxSliderTurno = 14;
        }
        break;
      case 11:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 6;

        }
        else{

          this.maxSliderTurno = 16;
        }
        break;
      case 10:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 8;

        }
        else{

          this.maxSliderTurno = 18;
        }
        break;
      case 9:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 10;

        }
        else{

          this.maxSliderTurno = 20;
        }
        break;
      case 8:
        if(this.sliderDiaSemana == 6){
          this.maxSliderTurno = 12;

        }
        else{

          this.maxSliderTurno = 22;
        }
        break;
    }
    console.log(this.fechaSeleccionada);
  }

  ngOnInit(): void {

    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    // console.log(this.usuarioLogueado)
    this.agregarChartTurnosPorDia();
    this.agregarChartEspPorTurnos();  

    this.fireSvc.getAllHistorias().pipe(first())
    .toPromise()
    .then(historia=>{
      historia.forEach(histo => {
        console.log(histo.turno);
        if(histo.turno?.paciente.apellido === this.usuarioLogueado.email){
          this.historia.push(histo);
          this.flag = false;
        }
        else{
          console.log("uid no iguales en historial");
        }
      });


    });
    this.fireSvc.getAllTurnos().pipe(first())
    .toPromise()
    .then(turnos=>{
      this.arrayExcelTurno = <any>turnos;
    });
    this.fireSvc.getAllEstados().pipe(first())
    .toPromise()
    .then(estados=>{
      this.estadosAdmin = estados;
      estados.forEach(estado => {
        if(this.usuarioLogueado.uid === estado.paciente.uid){
          if(estado.estado == Estados.REALIZADO){
            this.estados.push(JSON.parse(JSON.stringify(estado)));
            // console.log(this.estados)
          }

        }
      });
      // console.log(this.estados)
    });

    this.fireSvc.getAllLogs().pipe(first())
    .toPromise()
    .then(logs=>{
      this.logs = logs;
    })
    this.fireSvc.getAllUsers().pipe(first())
    .toPromise()
    .then(users=>{
      this.usuarios = users;
    })

    this.sliderDiaSemanaString = 'Lunes';


    if(this.usuarioLogueado.paciente){
      this.flag = true;

    }
    if(this.usuarioLogueado.especialista){

      // console.log(this.usuarioLogueado);
      if(this.usuarioLogueado.disponibilidadEsp != undefined){
        this.usuarioLogueado.disponibilidadEsp.forEach(esp=>{
          if(esp){

          }
          // console.log(esp);
          this.disp.push(JSON.parse(JSON.stringify(esp)));
          // console.log(this.disp);

        })

      }
    }


  }

  turnoSeleccionado: Turnos;
  mostrarHistoria: boolean = false;

  //admin
  mostrarLogs: boolean = false;
  mostrarGrafEspecialidad: boolean = false;
  mostrarGrafDia: boolean = false;

  verLogs(){
    this.mostrarLogs = true;
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = false;
  }
  ocultarLogs(){
    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = false;
  }

  vergrafPorEspec(){
    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = true;
    this.mostrarGrafDia = false;
  }
  ocultarGrafPorEspec(){
    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = false;
  }

  vergrafPorDia(){
    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = true;
  }
  ocultarGrafPorDia(){
    this.mostrarLogs = false;    
    this.mostrarGrafEspecialidad = false;
    this.mostrarGrafDia = false;
  }
  
  cargarHistoriaClinica(turno: Turnos){
    // console.log("hola")
    this.mostrarHistoria = true;
    this.turnoSeleccionado = turno;
  }
  
  
  capturarHora(e){
      this.horariosAElegir.forEach(element => {
        if(e.target.checked){
            if(element.hora == e.target.value){
              this.arrayHorarios.push(element);
            }
        }
        else{
          if(element.hora == e.target.value){
            let i = this.arrayHorarios.indexOf( element)
            this.arrayHorarios.splice(i,1);
            console.log(this.arrayHorarios);

          }
        }
      });
  }

  mostrarHorarios(){
    this.mostrarHorario = true;
    // console.log(this.minimo)
    // console.log(this.maximo)
    // console.log(this.fechaSeleccionada);
  }

  calcularArrayHorarios(especialidad:string){
    let aux: number;
    let auxArr: Horarios[] = [];
    let auxStr:any;
    let horarios:any;
  
    if(this.sliderCantTurnos)
    for (let i = 0; i < this.sliderCantTurnos; i++) {


      if(i == 0){
        aux = this.sliderHoraComienzo;
        auxStr = aux.toString()
          auxStr = auxStr + ':00';
          horarios = {
            hora: auxStr,
            disponible: true
          }
          auxArr.push(horarios);
      }
      else{

        aux += 0.50;
        if(aux % 1 == 0){
          auxStr = aux.toString()
          auxStr = auxStr + ':00';
          horarios = {
            hora: auxStr,
            disponible: true
          }
          auxArr.push(horarios);
        }
        else{
          auxStr = aux.toString().split('.');
          auxStr[1] = "30";

          auxStr = auxStr[0]+':'+auxStr[1];
          // horarios.hora = auxStr;
          // horarios.disponible = true;
          horarios = {
            hora: auxStr,
            disponible: true
          }
          auxArr.push(horarios);
        }

        // console.log(auxStr);

      }
      // console.log(auxArr);

    }
    // auxArr contiene horarios y disponibilidad de cada uno


    // console.log(auxStr[0]+':'+auxStr[1]);

    this.turnoAux = {
      especialidad: especialidad,
      fecha: this.fechaSeleccionada,
      horarios: auxArr
    }
    this.disp.push(JSON.parse(JSON.stringify(this.turnoAux)));



  }

  seleccionDispo(especialidad: string){


    const prueba = {
      especialidad: especialidad,
      fecha: this.fechaSeleccionada,
      horarios: this.arrayHorarios,
    };
    // console.log(prueba);

    this.calcularArrayHorarios(especialidad);
    // console.log(this.disp);
    this.usuarioLogueado.disponibilidadEsp = this.disp;
    this.fireSvc.updateUsuario(this.usuarioLogueado);

    this.alertas.mostraAlertaSimpleSuccess("Carga Exitosa!!", "Disponibilidad");
  }
  capturarSelectEspecialidad(value){
    // console.log(value);

    this.especialidad = value.$ngOptionLabel.trim();
    console.info()
  }

  /**ARREGLAR EL CAMBIAR IMAGEN DE PERFIL */
  // onFileSelectedFoto(event: any, multiple: any) {
  //   const filelist = event.target.files;
    
  //   if(multiple){
      
  //     if(filelist.length == 1){
  //       this.subirArchivos = false;
  //       this.mensajeSubida = "Seleccione 2 archivos";
  //       console.log("1 archivo");
  //     }
  //     if(filelist.length != 2){
  //       this.subirArchivos = false;
  //       this.mensajeSubida = "Seleccionar solo 2 archivos";
  //     }
  //     else{
  //       if(filelist[0] != null ){

  //         this.subirArchivos = true;
  //         const file = filelist[0];
  //         this.formGroup.patchValue({
  //           fileSource: file
  //         });         
          
  //         this.mensajeArchivo = `Archivo preparado: ${filelist[0].name}`;
  //         this.nombreArchivo = this.user.obtenerFechaHora() + " " + filelist[0].name;

  //       }
  //       if(filelist[1] != null){
  //         // console.log("archivo 2?");
  //         const file2 = filelist[1];
          
  //         this.formGroup.patchValue({
  //           fileSource2: file2
  //         });
  //         this.mensajeArchivo2 = `Archivo preparado: ${filelist[1].name}`;
  //         this.mensajeArchivo2 = this.user.obtenerFechaHora() + " " + filelist[1].name;


  //       }

  //     }

  //   }
  //   else{
  //     // console.log("llegue");
  //     if(filelist[0] != null){
  //       this.subirArchivos = true;
  //       const file = filelist[0];
  //       this.formGroup.patchValue({
  //         fileSource: file
  //       });
  //       this.mensajeArchivo = `Archivo preparado: ${filelist[0].name}`;
  //       this.nombreArchivo = this.user.obtenerFechaHora() + " " + filelist[0].name;
  //       console.log(this.nombreArchivo);

  //     }

  //   }
    
  // }



  /*******************************ARCHIVOS */

  exportarExcel(){
    let reportData = {
      title: 'ClinicaRRM - Listado de usuarios en el sistema',
      data: this.estadosAdmin,
      headers: [
        'Especialidad',
        'Reseña',
        'Nombre medico',
        'Apellido medico',
        'Email de medico',
        'Dni de medico',
        'Edad de medico',
        'Fecha de atencion',
        'Hora de atencion',
        'Estado de atencion',
        'Nombre Paciente',
        'Apellido Paciente',
        'Dni paciente',
        'Edad paciente',
      ]
    }

    this.excel.exportExcel(reportData);
  }

  
  exportarPdf(){
    let aux  = [];
    this.arrayExcelTurno.forEach(turno => {
        if(this.usuarioLogueado.uid === turno.paciente.uid){
          aux.push(turno);
        }
    });

    console.log(aux);
    this.pdf.exportarPdf(aux);
  }
  graficoTorta(){


  }


  agregarChartTurnosPorDia(){
    if(this.usuarioLogueado.admin){
      this.chartCantPorDia = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Cantidad de turnos tomados por día'
        },
        credits: {
          enabled: false
        },
        
      });
  
      this.fireSvc.getAllTurnos().subscribe(turnos=>{
        this.turnos = turnos;
        let arrayOcurrencias = this.getOcurrencia(this.turnos,'fecha');
        arrayOcurrencias.sort(function(a, b) {
          return a.occurrence - b.occurrence;
        });
        
  
        
      arrayOcurrencias.forEach(ocurr=>{
        let data:SeriesOptionsType = {
          type: "column",
          colorByPoint: true,
          name: ocurr.fecha,
          data: [{y: ocurr.occurrence, name: ocurr.fecha, drilldown: ocurr.fecha}],
        }
        this.chartCantPorDia.addSeries(data,true,true)
      }); 
    });
      
    }
  
  }
  getOcurrencia(array:any[], key: string){
    let arr2 = [];
    
    array.forEach((x)=>{
       
    // Checking if there is any object in arr2
    // which contains the key value
     if(arr2.some((val)=>{ return val[key] == x[key] })){
         
       // If yes! then increase the occurrence by 1
       arr2.forEach((k)=>{
         if(k[key] === x[key]){ 
           k["occurrence"]++
         }
      })
         
     }else{
       // If not! Then create a new object initialize 
       // it with the present iteration key's value and 
       // set the occurrence to 1
       let a = {}
       a[key] = x[key]
       a["occurrence"] = 1
       arr2.push(a);
     }
  })
    
  return arr2
  }
  agregarChartEspPorTurnos(){
    // console.log(this.usuarioLogueado)
    if(this.usuarioLogueado.admin){
      let data= [];
    
      let x = 0
      let count = 0;
      
      this.fireSvc.getEspecialidades().pipe(first())
      .toPromise()
      .then(esp=>{
        

        this.especialidades = esp;
        this.especialidades.forEach(especialidad => {
          count = 0;
          for (let i = 0; i < this.turnos.length; i++) {
            if(this.turnos[i].especialidad == especialidad.nombre){
              count++;
            }
          }
          data.push({y: count, name: especialidad.nombre});
        });
        this.chartEspPorTurno = new Chart({
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Cantidad de turnos tomados por Especialidad'
          },
          credits: {
            // enabled: false
          },
          plotOptions: {
            pie:{
              allowPointSelect: true
            }
          },
          series: [{
            type: 'pie',
            name: 'Cantidad',
            data: data
          }]
          
        });


      });


    }
  }
  getOcurrenciaEstado(array : EstadoTurno[],key:any){
    let arr2 = [];
    
    array.forEach((turno)=>{
       
    // Checking if there is any object in arr2
    // which contains the key value
     if(arr2.some((val)=>{ return val[key] == turno[key] })){
         
       // If yes! then increase the occurrence by 1
       arr2.forEach((k)=>{
         if(k[key] === turno[key]){ 
           k["occurrence"]++
         }
      })
         
     }else{
       // If not! Then create a new object initialize 
       // it with the present iteration key's value and 
       // set the occurrence to 1
       let a = {}
       a[key] = turno[key]
       a["occurrence"] = 1
       arr2.push(a);
     }
  })
    
  return arr2
  }



















  chartTurnosPorMedicoFecha(){
    this.seleccioneFechaSolicitado = true;
    if(this.usuarioLogueado.admin){



    
    var fecha = new Date();

    // console.log(this.fechaSeleccionadaPicker);
    var hoy = fecha.getFullYear() + '-'+ (fecha.getMonth()+1)+ "-"+  fecha.getDate();

    this.chartTurnoPorMedicoFecha = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Cantidad de turnos por medico desde la fecha: ' + this.fechaSeleccionadaPicker + " hasta hoy "+ hoy
      },
      credits: {
        enabled: false
      },
      
    });
    let fechaSeleccione: string = '';
    let splitFecha = this.fechaSeleccionadaPicker.split('-');
    if(splitFecha[1] != '10' && splitFecha[1] != '11' && splitFecha[1] != '12'){
      
      let mes = splitFecha[1].split('0')
      
      fechaSeleccione = splitFecha[0] + '-' + mes[1] + '-' + splitFecha[2];
    }
    else{
      fechaSeleccione = this.fechaSeleccionadaPicker;
    }
    
    console.log(fechaSeleccione)
    var fechaSeleccioneDate = Date.parse(fechaSeleccione);
    var hoyDate = Date.parse(hoy);
    var count : number = 0;
    var turnoAux = [];
    var uidConc = [];
    var fechaAux = [];
    var medicoAuxArr = [];
    var medicoAux: any;
      // console.log(turnos);
      // this.fireSvc.getAllEstados().pipe(first())
      // .toPromise()
      // .then(estados=>{
        console.log(this.estadosAdmin.length)
        this.estadosAdmin.forEach(est=>{
          console.log(Date.parse(est.fecha))
          console.log(fechaSeleccioneDate)
          if(Date.parse(est.fecha) > fechaSeleccioneDate && Date.parse(est.fecha) <= hoyDate){
          
            if(est.estado != Estados.REALIZADO){
              turnoAux.push(est.especialista);

            }

          }
        });
        let objOcurrenciaMedico = this.getOcurrencia(turnoAux,'uid')
        console.log(objOcurrenciaMedico);
        // this.fireSvc.getAllUsers().pipe(first())
        // .toPromise()
        // .then(user=>{
          this.usuarios.forEach(med=>{
            if(med.especialista){
              objOcurrenciaMedico.forEach(ocurr => {
                if(ocurr.uid == med.uid){
                  count = ocurr.occurrence;
                  console.log("imprimo este: " + med.nombre)
                    let data:SeriesOptionsType = {
                    type: "column",
                    colorByPoint: true,
                    name: med.nombre,
                    data: [{y: count,name: med.nombre + " " + med.apellido }],
                  }
                  this.chartTurnoPorMedicoFecha.addSeries(data,true,true)

                }
              });

            }
          })
        // })
        turnoAux.forEach(element => {
          console.log(element.estado)
          
        });
        
      // })

    }
    
  }



  chartTurnosPorMedicoFechaFinalizado(){
    this.seleccioneFechaFinalizado = true;
    if(this.usuarioLogueado.admin){

      
    var fecha = new Date();

    // console.log(this.fechaSeleccionadaPicker);
    var hoy = fecha.getFullYear() + '-'+ (fecha.getMonth()+1)+ "-"+  fecha.getDate();

    this.chartTurnoPorMedicoFechaFinalizado = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Cantidad de turnos por medico desde la fecha: ' + this.fechaSeleccionadaPickerRealizado + " hasta hoy "+ hoy
      },
      credits: {
        enabled: false
      },
      
    });
    let fechaSeleccione: string = '';
    let splitFecha = this.fechaSeleccionadaPickerRealizado.split('-');
    if(splitFecha[1] != '10' && splitFecha[1] != '11' && splitFecha[1] != '12'){
      
      let mes = splitFecha[1].split('0')
      
      fechaSeleccione = splitFecha[0] + '-' + mes[1] + '-' + splitFecha[2];
    }
    else{
      fechaSeleccione = this.fechaSeleccionadaPickerRealizado;
    }
    
    console.log(fechaSeleccione)
    var fechaSeleccioneDate = Date.parse(fechaSeleccione);
    var hoyDate = Date.parse(hoy);
    var count : number = 0;
    var turnoAux = [];
    var uidConc = [];
    var fechaAux = [];
    var medicoAuxArr = [];
    var medicoAux: any;
      // console.log(turnos);
      this.fireSvc.getAllEstados().subscribe(estados=>{
        console.log(estados.length)
        estados.forEach(est=>{
          console.log(Date.parse(est.fecha))
          console.log(fechaSeleccioneDate)
          if(Date.parse(est.fecha) > fechaSeleccioneDate && Date.parse(est.fecha) <= hoyDate){
          
            if(est.estado == Estados.REALIZADO){
              turnoAux.push(est.especialista);

            }

          }
        });
        let objOcurrenciaMedico = this.getOcurrencia(turnoAux,'uid')
        console.log(objOcurrenciaMedico);
        this.fireSvc.getAllUsers().subscribe(user=>{
          user.forEach(med=>{
            if(med.especialista){
              objOcurrenciaMedico.forEach(ocurr => {
                if(ocurr.uid == med.uid){
                  count = ocurr.occurrence;
                  console.log("imprimo este: " + med.nombre)
                    let data:SeriesOptionsType = {
                    type: "column",
                    colorByPoint: true,
                    name: med.nombre,
                    data: [{y: count,name: med.nombre + " " + med.apellido }],
                  }
                  this.chartTurnoPorMedicoFechaFinalizado.addSeries(data,true,true)

                }
              });

            }
          })
        })
        turnoAux.forEach(element => {
          console.log(element.estado)
          
        });
        
      })

    }
    
  }





  obtenerMedicoOcurrenciaTurno(uidConc: any[],med){
    uidConc.forEach(uid => {
      if(med != null){
        if(uid == med.uid){
          console.log("muestro "+med.nombre)
        }
      }
    });
  }
  obtenerMedicoIgual(medicoAuxArr: any[],uid: string){
    let retorno = null;
    for (let medico of medicoAuxArr) {
      if(medico.especialista.uid == uid){
        retorno = medico.especialista;
        break;
      }
      else{
        retorno = null;
      }
      
    }
    return retorno;
  }
  
  descargarLogsAPDF(){

    var doc = new jsPDF();
    let table = window.document.getElementById("chart0");
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    // let imgTable;
    html2canvas.default(table).then(function (canvas)
    {      
      let imgTable = canvas.toDataURL("image/png");
      doc.addImage(imgTable,'JPG',10,10,width,height)
      doc.save('Listado_logs_usuarios.pdf');
    });

  }  
  
  descargarCantEspPorTurno(){
    let v = null;
    
    var doc = new jsPDF();
    
    let svg = window.document.getElementById("chart01").children[0].innerHTML;
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    if (svg)
    svg = svg.replace(/\r?\n|\r/g, '').trim();
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    v = Canvg.from(ctx, svg).then(v=>{
      v.start()
      var imgData = canvas.toDataURL('image/png');
      // Generate PDF
      var doc = new jsPDF('l', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 40, 40, 250, 80);
      doc.save('Cantidad_Turnos_Por_Especialidad.pdf');
    });
  }

  descargarCantTurnosPorDiaAPdf(){
    let v = null;
    
    var doc = new jsPDF();
    
    let svg = window.document.getElementById("chart02").children[0].innerHTML;
  
    if (svg)
    svg = svg.replace(/\r?\n|\r/g, '').trim();
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    v = Canvg.from(ctx, svg).then(v=>{
      v.start()
      var imgData = canvas.toDataURL('image/png');
      // Generate PDF
      var doc = new jsPDF('l', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 40, 40, 250, 150);
      doc.save('Cantidad_Turnos_Por_Dia.pdf');
    });
  }






  descargarCantTurnosSolicitados(){
    let v = null;
    
    var doc = new jsPDF();
    
    let svg = window.document.getElementById("chart3").children[0].innerHTML;
  
    if (svg)
    svg = svg.replace(/\r?\n|\r/g, '').trim();
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    v = Canvg.from(ctx, svg).then(v=>{
      v.start()
      var imgData = canvas.toDataURL('image/png');
      // Generate PDF
      var doc = new jsPDF('l', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 40, 40, 250, 150);
      doc.save('cantidadTurnosSolicitadosFecha.pdf');
    });
  }

  descargarCantTurnosFinalizados(){
    let v = null;
    
    var doc = new jsPDF();
    
    let svg = window.document.getElementById("chart4").children[0].innerHTML;
  
    if (svg)
    svg = svg.replace(/\r?\n|\r/g, '').trim();
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    v = Canvg.from(ctx, svg).then(v=>{
      v.start()
      var imgData = canvas.toDataURL('image/png');
      // Generate PDF
      var doc = new jsPDF('l', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 40, 40, 250, 150);
      doc.save('cantidadTurnosFinalizadosFecha.pdf');
    });
  }

  base64SvgToBase64Png (originalBase64, width) {
    
    return new Promise(resolve => {
        let img = document.createElement('img');
        img.onload = function () {
            document.body.appendChild(img);
            let canvas = document.createElement("canvas");
            let ratio = (img.clientWidth / img.clientHeight) || 1;
            document.body.removeChild(img);
            canvas.width = width;
            canvas.height = width / ratio;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
                let data = canvas.toDataURL('image/png');
                resolve(data);
            } catch (e) {
                resolve(null);
            }
        };
        img.src = originalBase64;
    });
}
  

}
