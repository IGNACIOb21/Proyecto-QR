import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importar firebase compat
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de tener un servicio de autenticación

@Component({
  selector: 'app-escaner-qr',
  templateUrl: './escaner-qr.page.html',
  styleUrls: ['./escaner-qr.page.scss'],
})
export class EscanerQRPage implements OnInit {
  
  segment = 'scan';
  qrText = '';
  scanResult = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private firebaseService: FirebaseService, // Inyecta el servicio de Firebase
    private firestore: AngularFirestore, // Para interactuar con Firestore
    private authService: AuthService // Servicio de autenticación
  ) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent, 
      cssClass: 'barcode-scanning-modal', 
      showBackdrop: false,
      componentProps: { 
        formats: [],
        lensFacing: LensFacing.Back
      }
    });
    
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.scanResult = data?.barcode?.displayValue;
      this.saveScanResultToFirebase(this.scanResult); // Guarda el resultado en Firebase
      this.updateAttendance(this.scanResult); // Actualiza las asistencias
    }
  }
  
  // Método para guardar el resultado en Firebase
  async saveScanResultToFirebase(scanResult) {
    const uid = await this.authService.getCurrentUserUid(); // Ahora funciona
    const path = `scans/${new Date().getTime()}`; // Genera un ID único para el documento de escaneo
    const data = {
      uid: uid,
      scanResult: scanResult,
      fechaActual: new Date().toISOString()
    };
    await this.firestore.collection('scans').doc(path).set(data);
    
  
    this.firebaseService.setDocument(path, data)
      .then(() => {
        console.log('Datos guardados correctamente en Firebase');
      })
      .catch((error) => {
        console.error('Error al guardar datos en Firebase:', error);
      });
  }
  
  // Método para actualizar las asistencias
  async updateAttendance(scanResult: string) {
    // Obtener el UID del usuario actual
    const uid = await this.authService.getCurrentUserUid(); 
  
    // Aquí extraemos los detalles del código QR (ejemplo: APP201/006D/L7)
    const [sigla, seccion, aula] = scanResult.split('/'); // Dividimos el string QR
  
    // Referencia a la clase en Firestore en la colección 'horarios'
    const claseRef = this.firestore.collection('horarios').doc(uid) // Usamos el UID del usuario
      .collection('clases') // Accede a la subcolección 'clases'
      .doc(`${sigla}-${seccion}-${aula}`); // Usamos los valores extraídos del QR como ID único
  
    // Usamos firebase.firestore.FieldValue.increment para incrementar el valor de 'asistencias'
    claseRef.update({
      'asistencias': firebase.firestore.FieldValue.increment(1) // Incrementamos las asistencias
    })
    .then(() => {
      console.log('Asistencia actualizada correctamente');
    })
    .catch((error) => {
      console.error('Error al actualizar la asistencia:', error);
    });
  }
  
}
