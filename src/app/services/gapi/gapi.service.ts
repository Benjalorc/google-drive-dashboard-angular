import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
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

	async checkStatus(){


		//Si aun no existe una instancia de googleAuth la inicializa
		//Y retorna un JSON que se podra leer para saber que aun
		//No se ha inicializado googleAuth

		if(!this.googleAuth){

	        let ready = await this.gapi.client.init({
	          'apiKey': this.apiKey,
	          'clientId': this.clientId,
	          'scope': this.scope,
	          'discoveryDocs': this.discoveryDocs
	        });
	        this.googleAuth = this.gapi.auth2.getAuthInstance();
	    }

		//Si la instancia de googleAuth existe retorna
		//Un JSON con el valor del estado de conexion
		let con = this.isLogged();

		if(con){

			this.gapi.client.drive.changes.getStartPageToken().then((res) =>{
				this.changesToken = res.result.startPageToken
			});
		}
		return {"iniciado": true, "valor": con};
	}

	isLogged(){

		return this.googleAuth.isSignedIn.get();
	}

	getAbout(): Observable<any>{

		return new Observable((observer) => {

			this.gapi.client.drive.about.get({
	          'fields': "storageQuota, maxUploadSize, maxImportSizes"
	        }).then((response)=> {

			    observer.next(response);
			    observer.complete()
	        });
		});
	}

	getChanges(): Observable<any>{

		if(!this.changesToken || this.changesToken == ""){

			return new Observable((observer) =>{

				this.gapi.client.drive.files.list({fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime', orderBy: "modifiedTime desc", pageSize: 5}).then((res) =>{

					this.filesToken = res.nextPageToken;
				    observer.next(res);
				    observer.complete()
				});
			});

		}
		else{

			return new Observable((observer) =>{

				this.gapi.client.drive.files.list({pageToken: this.filesToken, fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime', orderBy: "modifiedTime desc", pageSize: 5}).then((res) =>{

					this.filesToken = res.nextPageToken;
				    observer.next(res);
				    observer.complete()
				});
			});

		}
	}

	getFilesList(pageToken){

		let data = {
			pageSize: 5,
			pageToken: pageToken,
			fields: 'nextPageToken, files, files/webViewLink, files/name, files/modifiedTime, files/mimeType',
			q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation' or mimeType='application/vnd.google-apps.drawing'",
			orderBy: "modifiedTime desc"
		};

		return this.gapi.client.drive.files.list(data);
	}


}