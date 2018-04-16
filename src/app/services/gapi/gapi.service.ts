import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GapiService {

	private apiKey: string;
	private clientId: string;
	private scope: string;
	private discoveryDocs: string[];
	private gapi: any;
	private googleAuth: any;

	private changesToken: string;
	private filesToken: string;

	private data: Observable<any>;

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
			let con = _self.isLogged();

			if(con){

				this.gapi.client.drive.changes.getStartPageToken()
				.then((res) =>{_self.changesToken = res.result.startPageToken});
			}
			return {"iniciado": true, "valor": con};
	    }
	}

	isLogged(){

		return this.googleAuth.isSignedIn.get();
	}

	getAbout(): Observable<any>{

		let _self = this;

		return new Observable((observer) => {

			_self.gapi.client.drive.about.get({
	          'fields': "storageQuota, maxUploadSize, maxImportSizes"
	        }).then(function(response) {

			    observer.next(response);
			    observer.complete()
	        });
		});
	}

	getChanges(): Observable<any>{

		let _self = this;
		
		if(!this.changesToken || this.changesToken == ""){

			return new Observable((observer) =>{

				this.gapi.client.drive.files.list({fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime', orderBy: "modifiedTime desc", pageSize: 5})
				.then((res) =>{

					_self.filesToken = res.nextPageToken;

				    observer.next(res);
				    observer.complete()
				});
			});

		}
		else{

			return new Observable((observer) =>{

				this.gapi.client.drive.files.list({pageToken: _self.filesToken, fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime', orderBy: "modifiedTime desc", pageSize: 5})
				.then((res) =>{

					_self.filesToken = res.nextPageToken;

				    observer.next(res);
				    observer.complete()
				});
			});

		}
	}


	getFilesList(pageToken): Observable<any>{


		let _self = this;

		return new Observable((observer) =>{

			this.gapi.client.drive.files.list({pageSize: 5, pageToken: pageToken, fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime, files/mimeType', orderBy: "modifiedTime desc"})
			.then((res) =>{

				_self.changesToken = res.nextPageToken;

			    observer.next(res);
			    observer.complete()
			});
		});

	}


}