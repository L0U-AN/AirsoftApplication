import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { IonicModule } from '@ionic/angular';

import { MyEventsPageRoutingModule } from './my-events-routing.module';

import { MyEventsPage } from './my-events.page';
import { EditModalComponent } from './event-modal/edit-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyEventsPageRoutingModule,
    //Ng2SearchPipeModule,
  ],
  declarations: [MyEventsPage, EditModalComponent],
  entryComponents: [EditModalComponent],
})
export class MyEventsPageModule {}
