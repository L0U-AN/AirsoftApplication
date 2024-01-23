import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerFormComponent } from './manager-form.component';

@NgModule({
  declarations: [ManagerFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    // Ajoutez d'autres modules nécessaires ici
  ],
  exports: [ManagerFormComponent],
})
export class ManagerFormModule {}
