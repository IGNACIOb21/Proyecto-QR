import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc =  inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  //===== Cerrar Secion ======
  signOut() {
    this.firebaseSvc.signOut();
  }
}
