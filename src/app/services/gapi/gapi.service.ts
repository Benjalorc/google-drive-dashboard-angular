import { Injectable } from '@angular/core';

@Injectable()
export class GapiService {

	private apiKey: string;
	private clientId: string;
	private scope: string;
	private discoveryDocs: string[];
	private gapi: any;
	private googleAuth: any;

  constructor() { 

  	//Asignar los valores para inicializacion del cliente del api
	this.apiKey = 'AIzaSyAEdrFiBDNK-HVnj5qxU7gMNcN58zpkR_c';
	this.clientId = '774012725108-tnnusra4io75rsiih2jsp8ukch4j1auu.apps.googleusercontent.com';
	this.scope = 'https://www.googleapis.com/auth/drive';
	this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

	//Almacenar en variable privada la instancia de gapi
	this.gapi = window["gapi"];
  }

	checkStatus(){

		//Guardar el scope del servicio
		let _self = this;

		//Si aun no existe una instancia de googleAuth la inicializa
		//Y retorna un JSON que se podra leer para saber que aun
		//No se ha inicializado googleAuth

		if(!this.googleAuth){
	
	      setTimeout(() =>{

	        _self.gapi.client.init({
	          'apiKey': _self.apiKey,
	          'clientId': _self.clientId,
	          'scope': _self.scope,
	          'discoveryDocs': _self.discoveryDocs
	        }).then(function () {
	          
	          _self.googleAuth = _self.gapi.auth2.getAuthInstance();
			});
	      },500);

	      return {"iniciado": false, "valor": "false"};
	    }
	    else{

			//Si la instancia de googleAuth existe retorna
			//Un JSON con el valor del estado de conexion

			return {"iniciado": true, "valor": _self.isLogged()};
	    }
	}

	isLogged(){

		return this.googleAuth.isSignedIn.get();
	}

}