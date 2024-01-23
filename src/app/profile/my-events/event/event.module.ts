import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EventPageRoutingModule } from './event-routing.module';
import { ConfModalComponent } from './terrain-modal/terrain-modal.component';
import { EventPage } from './event.page';
import { StatsModalComponent } from './stats-modal/stats-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EventPageRoutingModule,
    //Ng2SearchPipeModule,
    //NgxQRCodeModule,
  ],
  declarations: [
    EventPage,
    ConfModalComponent,
    StatsModalComponent,
  ],
  entryComponents: [ConfModalComponent, StatsModalComponent],
})
export class EventPageModule {}
