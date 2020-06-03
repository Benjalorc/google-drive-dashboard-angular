import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

	gapi: any;
	gUser: any;
	isLogged: boolean;
	username: string;
	imgUrl: string;

	loading: boolean;

	images: string[] = ["../../../assets/img/slide-1-transparent.png", "../../../assets/img/slide-2-transparent.png", "../../../assets/img/slide-3-transparent.png"];

  constructor(private router: Router, 
  			  private route:ActivatedRoute,
  			  private cd: ChangeDetectorRef,
  			  config: NgbCarouselConfig) { 

		config.interval = 4000;
	
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
	  	this.loading = true;

	  	//Inicializa un boton pre-configurado para permitir
	  	//El inicio de sesion

	  	function onSignIn(googleUser) {

	  		_self.gUser = googleUser;
	  		_self.username = googleUser.getBasicProfile().getName();
	  		_self.imgUrl = googleUser.getBasicProfile().getImageUrl();
			_self.isLogged = true;
			_self.loading = false;
			_self.cd.detectChanges();
		}

		function onFailure(err){ 
			console.log(err);
			_self.loading = false;
			_self.cd.detectChanges();
		}
  	
	  	this.gapi.signin2.render('my-signin2', {
	        'scope': 'profile email',
	        'width': 220,
	        'height': 50,
	        'longtitle': true,
	        'theme': 'light',
	        'onsuccess': onSignIn,
	        'onfailure': onFailure
	    });

	    setTimeout(() =>{
	    
			let element: HTMLElement = document.querySelector("#my-signin2 > div") as HTMLElement;
			element.addEventListener("click", function(){
				_self.loading = true;
			});
	    },500);
	    this.loading = false;
		this.cd.detectChanges();
	}

	cambiarUsuario(){
		let element: HTMLElement = document.querySelector("#my-signin2 > div") as HTMLElement;
		element.click()
	}

}