import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscanerQRPageRoutingModule } from './escaner-qr-routing.module';

import { EscanerQRPage } from './escaner-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanerQRPageRoutingModule
  ],
  declarations: [EscanerQRPage]
})
export class EscanerQRPageModule {}
