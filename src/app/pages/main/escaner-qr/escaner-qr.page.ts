import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { ModalController, Platform } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BarcodeScanningModalComponent } from '../escaner-qr/barcode-scanning-modal.component';

interface Asignatura {
  asistencias: number;
  // Otras propiedades que pueda tener la asignatura
}

@Component({
  selector: 'app-escaner-qr',
  templateUrl: './escaner-qr.page.html',
  styleUrls: ['./escaner-qr.page.scss'],
})
export class EscanerQRPage implements OnInit {
  
  segment = 'scan';
  qrText = '';
  scanResult = '';
  uid: string | null = null; // Variable para almacenar el UID del usuario logueado

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private firebaseService: FirebaseService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    // Obtener el UID del usuario logueado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid; // Asignar el UID del usuario logueado
        console.log('Usuario autenticado, UID:', this.uid);
        this.cargarAsignaturas(); // Cargar asignaturas después de obtener el UID, si aplica
      } else {
        console.error('No hay usuario autenticado');
      }
    });

    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then(() => {
        BarcodeScanner.checkPermissions().then(() => {
          BarcodeScanner.removeAllListeners();
        });
      });
    }
  }

  // Método para iniciar el escaneo
  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent, 
      cssClass: 'barcode-scanning-modal', 
      showBackdrop: false,
      componentProps: { 
        formats: [],  // Define los formatos de códigos de barras a escanear
        lensFacing: LensFacing.Back  // Define si se usa la cámara frontal o trasera
      }
    });
  
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.scanResult = data?.barcode?.displayValue;
      if (this.uid) { // Asegurarse de que el UID esté disponible
        this.saveScanResultToFirebase(this.scanResult); // Guarda el resultado en Firebase
        this.updateAttendance(this.scanResult); // Actualiza las asistencias en la asignatura
      } else {
        console.error('UID no encontrado. Usuario no autenticado.');
      }
    }
  }

  // Método para guardar el resultado del escaneo en Firebase
  saveScanResultToFirebase(scanResult: string) {
    if (!this.uid) {
      console.error('UID no disponible. No se puede guardar el escaneo en Firebase.');
      return;
    }

    const path = `scans/${new Date().getTime()}`; // Genera un ID único basado en la fecha y hora
    const data = {
      uid: this.uid, // Usa el UID almacenado
      EscanerQR: scanResult,
      timestamp: new Date().toISOString(),  // Agrega un timestamp para el registro
    };

    // Guarda los datos en Firebase
    this.firebaseService.setDocument(path, data)
      .then(() => {
        console.log('Datos guardados correctamente en Firebase');
      })
      .catch((error) => {
        console.error('Error al guardar datos en Firebase:', error);
      });
  }

  // Método para actualizar las asistencias
  async updateAttendance(asignaturaId: string) {
    try {
      const asignaturaRef = this.firestore.collection('asignaturas').doc(asignaturaId);
      
      // Obtener los datos del documento a través de un observable y suscribirse a él
      asignaturaRef.get().subscribe((asignaturaDoc) => {
        if (asignaturaDoc.exists) {
          const data = asignaturaDoc.data() as Asignatura;  // Hacer un casting a la interfaz Asignatura
          const currentAssists = data?.asistencias || 0;
          asignaturaRef.update({
            asistencias: currentAssists + 1
          });
          console.log('Asistencia actualizada correctamente');
        } else {
          console.log('Asignatura no encontrada');
        }
      });
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
    }
  }

  // Método para cargar asignaturas (placeholder)
  cargarAsignaturas() {
    console.log('Cargando asignaturas para UID:', this.uid);
    // Lógica adicional aquí, si aplica
  }
}
