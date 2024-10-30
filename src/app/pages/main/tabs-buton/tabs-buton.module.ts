import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsButonPageRoutingModule } from './tabs-buton-routing.module';

import { TabsButonPage } from './tabs-buton.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsButonPageRoutingModule
  ],
  declarations: [TabsButonPage]
})
export class TabsButonPageModule {}
