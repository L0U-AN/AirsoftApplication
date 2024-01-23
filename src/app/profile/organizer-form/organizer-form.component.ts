import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/services/user.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-organizer-form',
  templateUrl: './organizer-form.component.html',
  styleUrls: ['./organizer-form.component.scss'],
})
export class OrganizerFormComponent implements OnInit {

  user: User;
  organizerForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder) {}

  ngOnInit() {
    console.log('OnInit - user data:', this.user);
    if (!this.user) {
      console.error('User data is empty or undefined');
      return;
    }
    this.organizerForm = this.fb.group({
      firstName: [this.user[0].firstName, [Validators.required]],
      lastName: [this.user[0].lastName, [Validators.required]],
      uid: [this.user[0].uid, [Validators.required]],
      title: [
        `Demande : ${this.user[0].firstName} ${this.user[0].lastName}`,
        [Validators.required],
      ],
      email: [this.user[0].email, [Validators.required, Validators.email]],
      companyNumber: [''],
      companyName: [''],
      terrainName: ['', [Validators.required]],
      terrainAddress: ['', [Validators.required]],
      terrainPhone: ['', [Validators.required]],
      terrainEmail: ['', [Validators.required, Validators.email]],
      terrainWebsite: [''],
      terrainDescription: ['', [Validators.required]],
      status: ['PENDING', [Validators.required]],
      adminId: [null],
    });
    console.log('Organizer form initialized:', this.organizerForm.value);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss(this.organizerForm.value, 'confirm');
  }
}
