import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HederComponent } from './components/heder/heder.component';
import { CustomImputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HederComponent,
    CustomImputComponent,
    LogoComponent
  ],
  exports: [
    HederComponent,
    CustomImputComponent,
    LogoComponent,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
