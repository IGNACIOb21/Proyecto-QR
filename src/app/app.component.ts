import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menuCtrl: MenuController, private firebaseService: FirebaseService) {}

  signOut() {
    this.firebaseService.signOut();
  }

  // Método para cerrar el menú
  closeMenu() {
    this.menuCtrl.close();  // Cierra el menú actual
  }
}
