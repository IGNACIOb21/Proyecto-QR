import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User, Horario } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, getFirestore, setDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
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
  horario: Horario | null = null; // Tipado explícito

  constructor() {
    // Inicializa Firebase con la configuración de tu entorno
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  //======================  Autenticación =======================
  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  regidtroIn(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  updateUserData(uid: string, data: any): Promise<void> {
    const userDocPath = `users/${uid}`;
    return this.setDocument(userDocPath, data);
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //======================  Base de Datos =======================
  setDocument(path: string, data: any) {
    return setDoc(doc(this.db, path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(this.db, path))).data();
  }

  getClasesPorDia(dia: string): any[] {
    if (this.horario && this.horario['clases']) {
      return this.horario['clases'].filter((clase: any) => clase.dia === dia);
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

  async getHorariosDelUsuario(uid: string): Promise<any> {
    const userDocPath = `users/${uid}`;
    const userDoc = await this.getDocument(userDocPath);

    if (userDoc && userDoc['horario']) {
      return userDoc['horario'];
    } else {
      return null;
    }
  }

  //====================== Funciones de Escaneo =======================
  // Guardar el resultado del escaneo con la fecha actual
  async saveScanResult(scanResult: string, uid: string): Promise<void> {
    try {
      const fecha = new Date().toISOString();
      const scanData = { uid, EscanerQR: scanResult, fecha };
      const scanDocPath = `scan/${uid}`;
      await this.setDocument(scanDocPath, scanData);
      console.log('Resultado del escaneo guardado con éxito:', scanData);
    } catch (error) {
      console.error('Error al guardar el resultado del escaneo:', error);
      throw error;
    }
  }

  // Procesar el resultado del escaneo y actualizar asistencia si coincide
  async processScanResult(scanResult: string, uid: string): Promise<boolean> {
    const [sigla, seccion, sala] = scanResult.trim().split('|'); // Dividimos el QR en sigla, sección y sala

    // Referencia al documento de asignaturas del usuario
    const asignaturaDocPath = `asignaturas/${uid}`;
    const asignaturaDocSnap = await this.getDocument(asignaturaDocPath);

    if (asignaturaDocSnap) {
      const asignaturas = asignaturaDocSnap['clases'];

      // Buscar la asignatura que coincida
      const asignaturaEncontrada = asignaturas.find(
        (asignatura: any) =>
          asignatura.sigla === sigla &&
          asignatura.seccion === seccion &&
          asignatura.sala === sala
      );

      if (asignaturaEncontrada) {
        // Incrementar asistencia
        asignaturaEncontrada.asistencias = (asignaturaEncontrada.asistencias || 0) + 1;

        // Actualizar el documento en Firestore
        await updateDoc(doc(this.db, asignaturaDocPath), { clases: asignaturas });

        console.log(`Asistencia incrementada para la asignatura: ${sigla}`);
        return true; // Indicar que la asistencia fue incrementada
      }
    }

    console.error('No se encontró una asignatura válida para el escaneo.');
    return false; // No se encontró coincidencia
  }
}
