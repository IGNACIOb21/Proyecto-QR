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
  qrText = '';
  scanResult = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private firebaseService: FirebaseService // Inyecta el servicio de Firebase
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
    }
  }

  // Método para guardar el resultado en Firebase
  saveScanResultToFirebase(scanResult: string) {
    const path = `scans/${new Date().getTime()}`; // Genera un ID único
    const data = {
      uid: 'user123', // Reemplaza con el UID del usuario actual
      EscanerQR: scanResult,
      timestamp: new Date().toISOString(),
    };

    this.firebaseService.setDocument(path, data)
      .then(() => {
        console.log('Datos guardados correctamente en Firebase');
      })
      .catch((error) => {
        console.error('Error al guardar datos en Firebase:', error);
      });
  }
}
