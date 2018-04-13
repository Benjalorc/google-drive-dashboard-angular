import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

	gapi: any;
	isLogged: boolean;

  constructor(private router: Router, 
  			  private route:ActivatedRoute,
  			  private cd: ChangeDetectorRef) { 

      let _self = this;
      _self.gapi = window["gapi"];
      setTimeout(() =>{
	    _self.renderButton();
      },200);
  }

  ngOnInit() {

  }

	renderButton(){

	  	let _self = this;

	  	//Inicializa un boton pre-configurado para permitir
	  	//El inicio de sesion

	  	function onSignIn(googleUser) {

			_self.isLogged = true;
			_self.router.navigate(['/dashboard']);
			_self.cd.detectChanges();
		}

		function onFailure(err){ console.log(err)}
  	
	  	this.gapi.signin2.render('my-signin2', {
	        'scope': 'profile email',
	        'width': 240,
	        'height': 50,
	        'longtitle': true,
	        'theme': 'dark',
	        'onsuccess': onSignIn,
	        'onfailure': onFailure
	      });
	}
}