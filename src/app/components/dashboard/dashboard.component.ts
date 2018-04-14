import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GapiService } from '../../services/gapi/gapi.service'
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  gapi: any;
  isLogged: boolean;

  username: string;
  usermail: string;
  userpic: string;

  storageLimit: number;
  storageUsage: number;
  storageUsageDrive: number;
  storageUsageTrash: number;
  maxUploadSize: number;
  maxImportSizes: any = {
    'documents': 0,
    'presentation': 0,
    'spreadsheet': 0,
    'draw': 0
  };

  trashStorageChart: any;
  driveStorageChart: any;
  totalStorageChart: any;

  sessionExpires: number;

  loading: boolean;

  constructor(private myGapi: GapiService, 
              private router: Router, 
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) { 

      let _self = this;
      setTimeout(() =>{

        _self.gapi = window["gapi"];
        _self.validateStatus();
      },500)
  }

  ngOnInit() {

  }

  validateStatus(){

    let _self = this;
    let status = this.myGapi.checkStatus();

    this.loading = true;

    //Verifica el stado de conexion. Si no se consiguio
    //Se vuelve a verificar pasado medio segundo

    if(!status.iniciado){

      setTimeout(() =>{ _self.validateStatus(); },500);
    }
    else{

      this.loading = false;

      //Si el usuario no esta conectado lo redirecciona al inicio

      if(!status.valor){
        this.router.navigate(["/"])
      }
      else{
        this.isLogged = status.valor;
        this.cargarPerfil();
        this.cargarAlmacenamiento();
        this.cd.detectChanges();
      }
    }
  }

	signOut() {

   	let _self = this;
    let auth2 = this.gapi.auth2.getAuthInstance();

    //Desconecta al usuario de la aplicacion

  	auth2.signOut().then(function () {
   		_self.router.navigate(['/']);
   	});
	}

  cargarPerfil(){

    let user = this.gapi.auth2.getAuthInstance().currentUser.get()
    let profile = user.getBasicProfile();
    let expires = user.getAuthResponse().expires_at;

    this.usermail = profile.getEmail();
    this.username = profile.getName();
    this.userpic = profile.getImageUrl();

    this.sessionExpires = parseFloat(((expires - Date.now())/60000).toFixed(1));
  }

  cargarAlmacenamiento(){

    this.myGapi.getAbout().subscribe(data =>{

      if(data.status == 200){

        //Al recibir la respuesta de la peticion
        //Almacena los valores en variable del componente

        let quota = data.result.storageQuota;
        let imports = data.result.maxImportSizes;

        this.storageLimit = (!quota.limit ? 0 : parseFloat((quota.limit/1073741824).toFixed(2)) );
        this.storageUsage = (!quota.usage ? 0 : parseFloat((quota.usage/1073741824).toFixed(2)) );
        this.storageUsageDrive = (!quota.usageInDrive ? 0 : parseFloat((quota.usageInDrive/1073741824).toFixed(2)) );
        this.storageUsageTrash = (!quota.usageInTrash ? 0 : parseFloat((quota.usageInTrash/1073741824).toFixed(2)) );

        this.maxUploadSize = (!data.result.maxUploadSize ? 0 : parseFloat((data.result.maxUploadSize/1099511627776).toFixed(2)));

        let docsize = imports["application/vnd.google-apps.document"];
        let drawsize = imports["application/vnd.google-apps.drawing"];
        let sheetsize = imports["application/vnd.google-apps.spreadsheet"];
        let slidesize = imports["application/vnd.google-apps.presentation"];
          
        this.maxImportSizes.document = !parseFloat(docsize) ? 0 : (parseFloat(docsize)/1048576).toFixed(2);
        this.maxImportSizes.draw = !parseFloat(drawsize) ? 0 : (parseFloat(drawsize)/1048576).toFixed(2);
        this.maxImportSizes.spreadsheet = !parseFloat(sheetsize) ? 0 : (parseFloat(sheetsize)/1048576).toFixed(2);
        this.maxImportSizes.presentation = !parseFloat(slidesize) ? 0 : (parseFloat(slidesize)/1048576).toFixed(2);

        //Ya almacenadas las variables procede a dibujar las gráficas
        //Usando los datos recibidos

        this.drawStorageTotalChart();
        this.drawStorageDriveChart();
        this.drawStorageTrashChart();

        this.cd.detectChanges();
      }
    });  
  }


  drawStorageTotalChart(){

    let data = {
      labels: ['En uso','Disponible'],
      datasets: [{
        data: [this.storageUsage, this.storageLimit-this.storageUsage],
        backgroundColor: ['red','green']

      }]
    }

    this.totalStorageChart = this.drawChart('storageChartCanvas', 'pie', data);
  }

  drawStorageDriveChart(){

    let data = {
      labels: ['En Drive','Otros'],
      datasets: [{
        data: [this.storageUsageDrive, this.storageLimit-this.storageUsageDrive],
        backgroundColor: ['black','blue']

      }]
    }

    this.trashStorageChart = this.drawChart('driveChartCanvas', 'pie', data);
  }

  drawStorageTrashChart(){

    let data = {
      labels: ['Papelera','Otros'],
      datasets: [{
        data: [this.storageUsageTrash, this.storageLimit-this.storageUsageTrash],
        backgroundColor: ['black','blue']

      }]
    }

    this.trashStorageChart = this.drawChart('trashChartCanvas', 'pie', data);
  }


  drawChart(id, type, data) {          

        return new Chart(id, {
          type: type,
          data: data,
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });

  }
}