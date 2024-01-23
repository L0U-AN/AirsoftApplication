import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;
  newImageUrl: any;
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private storageService: StorageService
  ) {}
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get passwordConfirm() {
    return this.credentials.get('passwordConfirm');
  }

  get checkPasswords() {
    const pass = this.credentials.get('passwordConfirm').value;
    const confirmPass = this.credentials.get('password').value;
    return pass === confirmPass ? true : false;
  }

  async showAlert(err: string) {
    const alert = await this.alertController.create({
      message: err,
      buttons: ['OK'],
    });
    await alert.present();
  }



  ngOnInit() {
    this.credentials = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      photoURL: [null],
      birthDate: [null],
      sex: [null],
      phone: [''],
    });
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
        this.credentials.value.photoURL = await this.storageService.uploadImage(
          filePath,
          blob
        );
        console.log(this.credentials.value.photoURL);
      },
      (err) => {
        this.showAlert(err);
      }
    );
  }

  handleBirthDate(event) {
    this.credentials.value.birthDate = new Date(event.target.value);
    console.log(this.credentials.value.birthDate);
  }

  handleSex(event) {
    this.credentials.value.sex = event.target.value;
    console.log(this.credentials.value.sex);
  }

  async signup() {
    const loading = await this.loadingController.create();
    this.credentials.value.birthDate = new Date(
      this.credentials.value.birthDate
    );
    await loading.present();

    console.log('Before registering user');

    this.authService
      .register(this.credentials.value)
      .then(async (res) => {
        if (res.user.uid) {
          console.log(this.credentials.value);
          this.authService.sendVerificationMail();
          await this.dataService.addUser({
            firstName: this.credentials.value.firstName,
            lastName: this.credentials.value.lastName,
            uid: res.user.uid,
            role: 'USER',
            displayName: res.user.displayName,
            email: res.user.email,
            photoURL: this.credentials.value.photoURL,
            favoriteEvents: [],
            isOrganizer: false,
            isManager: false,
            sex: this.credentials.value.sex,
            birthDate: this.credentials.value.birthDate,
          });
          loading.dismiss();
          this.authService.logout();
          this.router.navigate(['verify-email']);
        }
      })
      .catch(async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registration failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      });
  }

}
