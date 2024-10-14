import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"app-futbol-base","appId":"1:210395209272:web:0c502b770c3ea70b5510cd","storageBucket":"app-futbol-base.appspot.com","apiKey":"AIzaSyCJ3YqMfQBp_QG7ul8e0d2PH3UB3UKIQJQ","authDomain":"app-futbol-base.firebaseapp.com","messagingSenderId":"210395209272","measurementId":"G-KQ12FM5WE4"})), provideAuth(() => getAuth())],
  bootstrap: [AppComponent],
})
export class AppModule {}
