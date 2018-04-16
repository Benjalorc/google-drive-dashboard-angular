import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FilemodalComponent } from './components/dashboard/filemodal/filemodal.component';

import { GapiService } from './services/gapi/gapi.service';

const appRoutes : Routes = [
  { path: '', component: InicioComponent},
  { path: 'dashboard', component: DashboardComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    DashboardComponent,
    FilemodalComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [GapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }