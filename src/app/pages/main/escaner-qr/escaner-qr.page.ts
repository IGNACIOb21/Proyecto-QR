import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { ModalController, Platform, ToastController } from '@ionic/angular';
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
  siglas = '';
  seccion = '';
  sala = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
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

      // Validar el formato del código QR
      const qrCodePattern = /^[A-Z]{3}[0-9]{3}\|\d{3}[A-Z]\|L\d+\|\d{8}$/; // Nuevo patrón
      if (!qrCodePattern.test(this.scanResult)) {
        await this.presentToast('El código escaneado no es válido en esta operación.', 'danger');
        return; // Terminar el flujo si el código no es válido
      }

      // Descomponer el código QR
      const [siglas, seccion, sala, fecha] = this.scanResult.split('|');

      // Validar que la fecha del código QR coincida con la fecha actual
      const today = new Date();
      const formattedToday = today.toISOString().slice(0, 10).replace(/-/g, ''); // Formato YYYYMMDD
      if (fecha !== formattedToday) {
        await this.presentToast('El código QR no es válido para hoy.', 'danger');
        return; // Terminar el flujo si la fecha no coincide
      }

      // Mostrar los datos desglosados
      this.siglas = siglas;
      this.seccion = seccion;
      this.sala = sala;

      // Obtener el UID del usuario autenticado
      const user = await this.firebaseService.getUserData();
      const uid = user?.uid;

      // Procesar el resultado del escaneo
      if (uid) {
        const success = await this.firebaseService.processScanResult(`${siglas}|${seccion}|${sala}`, uid);
        if (success) {
          await this.presentToast('El código QR se escaneó exitosamente.', 'success');
        } else {
          await this.presentToast('No se encontró una asignatura válida para el escaneo.', 'danger');
        }
      }
    }
  }
}
