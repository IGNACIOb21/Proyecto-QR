import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User, Horario } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  db: Firestore;
  horario: any = null;

  constructor() {
    // Inicializa Firebase con la configuración de tu entorno
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  //======================  Autenticacion =======================

  getAuth() {
    return getAuth();
  }

  //=========== Acceder =============
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========== crear nombre user en la BD =============
  regidtroIn(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========== actualisar user =============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  updateUserData(uid: string, data: any): Promise<void> {
    const userDocPath = `users/${uid}`; // Ruta del documento del usuario en Firestore
    return this.setDocument(userDocPath, data); // Usa el método `setDocument` para actualizar
  }

  // Obtener las asignaturas del estudiante por su UID
  async getAsignaturasByUserId(uid: string) {
    const asignaturasRef = this.firestore.collection('asignaturas', ref => ref.where('uid', '==', uid));
    const asignaturasSnapshot = await asignaturasRef.get().toPromise();
    return asignaturasSnapshot?.docs.map(doc => doc.data()) || [];
  }

  //=========== enviar email para restablecer contraseña =============
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //========= Cerrar Sesion =========
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //======================  Base de Datos =======================

  //========= Setear un documento (creo oremplasa)=========
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //========= obtener un documento =========
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Obtener el nombre del usuario autenticado
  async getUserName(): Promise<string | null> {
    const currentUser = getAuth().currentUser;

    if (currentUser) {
      // Si el usuario tiene un displayName configurado
      if (currentUser.displayName) {
        return currentUser.displayName;
      }

      // Si el displayName no está configurado, buscar en Firestore (opcional)
      const userDocPath = `users/${currentUser.uid}`; // Ruta del documento en Firestore
      const userData = await this.getDocument(userDocPath);

      if (userData && userData['displayName']) {
        return userData['displayName'];
      }
    }

    return null; // Si no se encuentra información del usuario
  }

  // Obtener el horario del usuario
  async getHorario(): Promise<void> {
    const currentUser = getAuth().currentUser;
  
    if (currentUser) {
      const uid = currentUser.uid; // Obtén el UID del estudiante autenticado
      const userHorarioDoc = doc(this.db, 'users', uid); // Ruta del documento del horario del estudiante
  
      try {
        const docSnap = await getDoc(userHorarioDoc);
  
        if (docSnap.exists()) {
          this.horario = docSnap.data()?.['horario'] || null; // Accede a 'horario' usando corchetes
          console.log(this.horario); // Verifica la estructura de datos
        } else {
          console.log('No se encontró el horario para este usuario');
        }
      } catch (error) {
        console.error('Error al obtener el horario:', error);
      }
    }
  }
  

  // Obtener las clases de un día y una hora específica
  getClasesPorDia(dia: string): any[] {
    if (this.horario && this.horario.clases) {
      return this.horario.clases.filter((clase: any) => clase.dia === dia);
    }
    return [];
  }

  async getUserData(): Promise<any> {
    const currentUser = this.getAuth().currentUser;
    if (currentUser) {
      const userDocPath = `users/${currentUser.uid}`;
      const userData = await this.getDocument(userDocPath);
      return userData;
    }
    return null;
  }

  // Obtener el horario del usuario por UID
async getHorariosDelUsuario(uid: string): Promise<any> {
  const userDocPath = `users/${uid}`; // Ruta del documento del usuario en Firestore
  const userDoc = await this.getDocument(userDocPath); // Usamos el método getDocument que ya tienes

  // Retornar el horario si está presente
  if (userDoc && userDoc['horario']) {
    return userDoc['horario']; // Accedemos a 'horario' usando corchetes
  } else {
    return null;
  }
}

}
