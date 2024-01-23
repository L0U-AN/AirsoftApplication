import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/services/user.model';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  newImageUrl: any;

  user: User;
  userForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    console.log(this.user);
    this.userForm = this.fb.group({
      firstName: [this.user[0].firstName, [Validators.required]],
      lastName: [this.user[0].lastName, [Validators.required]],
      email: [this.user[0].email, [Validators.required, Validators.email]],
      birthDate: [this.user[0].birthDate],
      phone: [this.user[0].phone],
      photoURL: [this.user[0].photoURL],
      sex: [this.user[0].sex,],
    });
  }

  handleBirthDate(event) {
    this.userForm.value.birthDate = new Date(event.target.value);
    console.log(this.userForm.value.birthDate);
  }

  handleSex(event) {
    this.userForm.value.sex = event.target.value;
    console.log(this.userForm.value.sex);
  }

  async showAlert(err: string) {
    const alert = await this.alertController.create({
      message: err,
      buttons: ['OK'],
    });
    await alert.present();
  }

  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  async uploadFile() {
    await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    }).then(
      async (photo) => {
        this.newImageUrl = await fetch(photo.webPath);
        const blob = await this.newImageUrl.blob();
        const filePath = `users/avatar/${this.imageName()}`;
        this.userForm.value.photoURL = await this.storageService.uploadImage(
          filePath,
          blob
        );
      },
      (err) => {
        this.showAlert(err);
      }
    );
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const user = {
      ...this.user[0],
      ...this.userForm.value,
    };
    return this.modalCtrl.dismiss(user, 'confirm');
  }
}
