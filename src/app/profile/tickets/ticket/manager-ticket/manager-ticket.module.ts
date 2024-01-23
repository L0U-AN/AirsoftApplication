import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerTicketPageRoutingModule } from './manager-ticket-routing.module';

import { ManagerTicketPage } from './manager-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerTicketPageRoutingModule
  ],
  declarations: [ManagerTicketPage]
})
export class ManagerTicketPageModule {}
