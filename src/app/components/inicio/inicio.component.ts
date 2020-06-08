import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
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
  			  private ngZone: NgZone,
  			  config: NgbCarouselConfig) { 

		config.interval = 3000;
	
  }

  ngOnInit() {

	this.gapi = window["gapi"];
	setTimeout(() =>{
		this.renderButton();
	},200);
  }

	renderButton(){

	  	this.loading = true;

	  	//Inicializa un boton pre-configurado para permitir
	  	//El inicio de sesion

	  	let onSignIn = (googleUser)=> {

	  		this.gUser = googleUser;
	  		this.username = googleUser.getBasicProfile().getName();
	  		this.imgUrl = googleUser.getBasicProfile().getImageUrl();
			this.isLogged = true;
			this.loading = false;
			this.cd.detectChanges();
		}

		let onFailure = (err)=>{ 
			console.log(err);
			this.loading = false;
			this.cd.detectChanges();
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
			element.addEventListener("click", ()=>{
				this.loading = true;
			});
	    },1000);
	    this.loading = false;
		this.cd.detectChanges();
	}

	cambiarUsuario(){
		let element: HTMLElement = document.querySelector("#my-signin2 > div") as HTMLElement;
		element.click()
	}

	goDashboard(){
		this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
	}

}