import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/services/user.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss'],
})
export class ManagerFormComponent implements OnInit {

  user: User;
  managerForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder) {}

  ngOnInit() {
    console.log('OnInit - user data:', this.user);

    if (!this.user) {
      console.error('User data is empty or undefined');
      return;
    }

    this.managerForm = this.fb.group({
      firstName: [this.user[0].firstName, [Validators.required]],
      lastName: [this.user[0].lastName, [Validators.required]],
      uid: [this.user[0].uid, [Validators.required]],
      title: [
        `Demande manager : ${this.user[0].firstName} ${this.user[0].lastName}`,
        [Validators.required],
      ],
      email: [this.user[0].email, [Validators.required, Validators.email]],
      companyNumber: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
      companyPhone: ['', [Validators.required]],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyWebsite: [''],
      companyDescription: ['', [Validators.required]],
      status: ['PENDING', [Validators.required]],
      adminId: [null],
    });

    console.log('Manager form initialized:', this.managerForm.value);
  }

  cancel(){
    console.log('Cancel method invoked');
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('Confirm method invoked with form data:', this.managerForm.value);
    this.modalCtrl.dismiss(this.managerForm.value, 'confirm');
  }
}

