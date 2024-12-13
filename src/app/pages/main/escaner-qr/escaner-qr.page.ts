import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-escaner-qr',
  templateUrl: './escaner-qr.page.html',
  styleUrls: ['./escaner-qr.page.scss'],
})
export class EscanerQRPage implements OnInit {
  segment = 'scan';
  scanResult = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private firebaseService: FirebaseService // Inyectamos FirebaseService
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
      componentProps: { formats: [], lensFacing: LensFacing.Back },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.scanResult = data?.barcode.displayValue; // Guardamos el resultado del escaneo

      // Obtener el UID del usuario autenticado
      const user = await this.firebaseService.getUserData();
      const uid = user?.uid;

      // Procesar el resultado del escaneo
      if (uid) {
        const success = await this.firebaseService.processScanResult(this.scanResult, uid);
        if (success) {
          console.log('Asistencia incrementada correctamente.');
        } else {
          console.error('No se encontró una asignatura válida para el escaneo.');
        }
      }
    }
  }
}
