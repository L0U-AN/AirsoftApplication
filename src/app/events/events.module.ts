import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    //Ng2SearchPipeModule,
  ],
  declarations: [EventsPage],
})
export class EventsPageModule {}
