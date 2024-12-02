import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // Datos del usuario que se mostrarán en la página
  student: any = {};
  isEditing = false; // Indica si el formulario de edición está activo

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  // Inicialización de la página
  async ngOnInit() {
    try {
      const currentUser = await this.firebaseService.getUserData(); // Llama al servicio para obtener los datos del usuario
      if (currentUser) {
        this.student = {
          ...currentUser,
          photoUrl: currentUser.photoUrl || 'src/assets/images/default-profile.png',
          carrera: currentUser.carrera || 'Carrera no especificada',
          telefono: currentUser.telefono || 'Teléfono no especificado',
        };
      } else {
        console.error('No se encontraron datos para el usuario autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

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

  // Guardar cambios después de la edición del perfil
  async saveChanges() {
    try {
      const currentUser = await this.firebaseService.getAuth().currentUser;
      if (currentUser) {
        await this.firebaseService.updateUserData(currentUser.uid, this.student); // Actualiza los datos en Firestore
        console.log('Datos actualizados correctamente');
        this.isEditing = false; // Cambia al modo de visualización
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  }

  // Alternar entre modo de visualización y edición
  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }
}
