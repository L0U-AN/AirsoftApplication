import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfilePage } from './profile.page';
import { OrganizerFormComponent } from './organizer-form/organizer-form.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ProfilePage, EditProfileComponent, OrganizerFormComponent],
  entryComponents: [EditProfileComponent, OrganizerFormComponent],
})
export class ProfilePageModule {}
