import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  student = {
    photoUrl: '',
    name: '',
    email: '',
    career: ''
  };

  constructor(private firebaseService: FirebaseService, private alertController: AlertController) {}

  // Método para cerrar sesión
  async signOut() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Cerrar',
          handler: () => {
            this.firebaseService.signOut(); // Llamada al servicio de Firebase para cerrar sesión
          },
        },
      ],
    });

    await alert.present();
  }
}
