import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth =inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService)

//======================  Autenticacion =======================

getAuth(){
  return getAuth();
}

//=========== Acceder =============
  signIn(user: User){
    return signInWithEmailAndPassword (getAuth(), user.email, user.password );
  }

  //=========== crear nombre user en la BD =============
  regidtroIn(user: User){
    return createUserWithEmailAndPassword (getAuth(), user.email, user.password);
  }

  //=========== actualisar user =============
  updateUser(displayName: string){
    return  updateProfile(getAuth().currentUser, {displayName})
  }



  //=========== enviar email para restablecer contraseña =============
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  //========= Cerrar Sesion =========
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //======================  Base de Datos =======================

  //========= Setear un documento (creo oremplasa)=========
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  //========= obtener un documento =========
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

}
