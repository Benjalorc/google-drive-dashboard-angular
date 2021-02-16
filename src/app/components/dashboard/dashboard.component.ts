import { Component, OnInit, NgZone } from '@angular/core';
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

  username: string;
  usermail: string;
  userpic: string;

  storageLimit: number;
  storageUsage: number;
  storageUsageDrive: number;
  storageUsageTrash: number;
  maxUploadSize: number = 0;
  maxImportSizes: any = {
    'documents': 0,
    'presentation': 0,
    'spreadsheet': 0,
    'draw': 0
  };

  trashStorageChart: any;
  driveStorageChart: any;
  totalStorageChart: any;

  fileChanges: any[];
  docFiles: any[] = [];
  numeroDocumentos: number;
  spreadFiles: any[] = [];
  numeroSpreadsheets: number;
  presentationFiles: any[] = [];
  numeroPresentaciones: number;
  drawingFiles: any[] = [];
  numeroDrawings: number;

  sessionExpires: number;

  sidenavOpen: boolean = false;
  loadingCenter: boolean = true;;
  loadingCorner: boolean = false;;

  constructor(private myGapi: GapiService, 
              private router: Router, 
              private ngZone: NgZone,
              private route: ActivatedRoute) { 
  }

  ngOnInit() {

    setTimeout(() =>{
      this.gapi = window["gapi"];
      this.validateStatus();
    },500);
  }

  async validateStatus(){

    this.loadingCenter = true;

    let status = await this.myGapi.checkStatus();

    //Verifica el stado de conexion. Si no se consiguio
    //Se vuelve a verificar pasado medio segundo

    if(!status.iniciado){

      setTimeout(() =>{ this.validateStatus(); },500);
    }
    else{

      this.loadingCenter = false;

      //Si el usuario no esta conectado lo redirecciona al inicio

      if(!status.valor){
        this.toHome();
      }
      else{
        this.cargarPerfil();
        this.cargarAlmacenamiento();
        this.cargarCambios();
        this.listarArchivos('');
      }
    }
  }

	signOut() {

   	let _self = this;
    let auth2 = this.gapi.auth2.getAuthInstance();

    //Desconecta al usuario de la aplicacion

  	auth2.signOut().then(()=> {
      setTimeout(() =>{
     		this.toHome();
      },2000)
   	});
	}

  toHome(){
    this.ngZone.run(() => this.router.navigate(["/"]) ).then();
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

        this.maxUploadSize = !data.result.maxUploadSize ? 0 : parseFloat((data.result.maxUploadSize/1024/1024/1024/1024).toFixed(2));

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
      }
    });  
  }

  cargarCambios(){

    this.myGapi.getChanges().subscribe(data =>{

      this.fileChanges = [];

      if(data.status == 200){

        data.result.files.forEach((element) =>{

              element.time = new Date(element.modifiedTime);
              this.fileChanges.push(element);
        })

      }

    });
  }

  async listarArchivos(pageToken){

    this.loadingCorner = true;

    let data = await this.myGapi.getFilesList(pageToken);

    if(data && data.status == 200){

      data.result.files.forEach((element) =>{

        element.time = new Date(element.modifiedTime);
        switch(element.mimeType){

          case "application/vnd.google-apps.document":
            this.docFiles.push(element);
          break;

          case "application/vnd.google-apps.spreadsheet":
            this.spreadFiles.push(element);
          break;

          case "application/vnd.google-apps.presentation":
            this.presentationFiles.push(element);
          break;

          case "application/vnd.google-apps.drawing":
            this.drawingFiles.push(element);
          break;
        }

      });

      this.numeroDocumentos = this.docFiles.length;
      this.numeroSpreadsheets = this.spreadFiles.length;
      this.numeroPresentaciones = this.presentationFiles.length;
      this.numeroDrawings = this.drawingFiles.length;

      if(data.result.nextPageToken){
        this.listarArchivos(data.result.nextPageToken);
        this.loadingCorner = true;
      }
      else{
        this.loadingCorner = false;
      }
    }

  }

  drawStorageTotalChart(){

    let data = {
      labels: ['En uso','Disponible'],
      datasets: [{
        data: [this.storageUsage, this.storageLimit-this.storageUsage],
        backgroundColor: ['#EAEAEA','#3FC1C9']

      }]
    }

    this.totalStorageChart = this.drawChart('storageChartCanvas', 'pie', data);
  }

  drawStorageDriveChart(){

    let data = {
      labels: ['En Drive','Otros'],
      datasets: [{
        data: [this.storageUsageDrive, this.storageLimit-this.storageUsageDrive],
        backgroundColor: ['#EAEAEA','#364F6B']

      }]
    }

    this.trashStorageChart = this.drawChart('driveChartCanvas', 'pie', data);
  }

  drawStorageTrashChart(){

    let data = {
      labels: ['Papelera','Otros'],
      datasets: [{
        data: [this.storageUsageTrash, this.storageLimit-this.storageUsageTrash],
        backgroundColor: ['#EAEAEA','#FC5185']

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

  toggleMenu(){
    if(this.sidenavOpen){

      document.getElementById("mySidenav").classList.remove("open");
      this.sidenavOpen = false;
    }
    else{

      document.getElementById("mySidenav").classList.add("open");
      this.sidenavOpen = true;
    }
  }

  handleCurtain(){

    if(this.sidenavOpen) this.toggleMenu();
  }
}
