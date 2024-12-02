import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth'; // Asegúrate de importar User

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  // Método para obtener el UID del usuario actual
  async getCurrentUserUid(): Promise<string> {
    const user: User | null = await this.afAuth.currentUser; // Espera a que se resuelva la promesa
    return user ? user.uid : ''; // Retorna el UID si el usuario está autenticado, de lo contrario retorna un string vacío
  }
}
