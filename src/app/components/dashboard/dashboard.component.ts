import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GapiService } from '../../services/gapi/gapi.service'

	
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  gapi: any;
  isLogged: boolean;

  constructor(private myGapi: GapiService, 
              private router: Router, 
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) { 

      let _self = this;
      _self.gapi = window["gapi"];
      _self.validateStatus();
      eval("window.yo = _self");
  }

  ngOnInit() {

  }

  validateStatus(){

    let _self = this;
    let status = this.myGapi.checkStatus();

    //Verifica el stado de conexion. Si no se consiguio
    //Se vuelve a verificar pasado medio segundo

    if(!status.iniciado){

      setTimeout(() =>{ _self.validateStatus(); },500);
    }
    else{

      //Si el usuario no esta conectado lo redirecciona al inicio

      if(!status.valor){
        this.router.navigate(["/"])
      }
      else{
        this.isLogged = status.valor;
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


}