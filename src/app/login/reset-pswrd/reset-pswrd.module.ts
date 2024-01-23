import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPswrdPageRoutingModule } from './reset-pswrd-routing.module';

import { ResetPswrdPage } from './reset-pswrd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPswrdPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ResetPswrdPage],
})
export class ResetPswrdPageModule {}
