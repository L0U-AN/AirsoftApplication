import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';
//import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { EventDetailPage } from './event-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule,
    //Ng2SearchPipeModule,
  ],
  declarations: [EventDetailPage],
})
export class EventDetailPageModule {}
