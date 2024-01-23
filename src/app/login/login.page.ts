import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService
      .login(this.credentials.value)
      .then((res) => {
        if (!res.user.emailVerified) {
          loading.dismiss();
          this.authService.logout();
          return this.router.navigate(['verify-email']);
        }
        if (res.user.uid) {
          loading.dismiss();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
      })
      .catch(async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      });
  }

  async loginWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService
      .googleAuth()
      .then((res) => {
        if (!res.user.emailVerified) {
          loading.dismiss();
          this.authService.logout();
          return this.router.navigate(['verify-email']);
        }
        if (res.user.uid) {
          loading.dismiss();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
      })
      .catch(async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      });
  }

  // async loginWithFacebook() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();
  //   this.authService
  //     .FacebookAuth()
  //     .then((res) => {
  //       console.log(res);
  //       if (!res.user.emailVerified) {
  //         loading.dismiss();
  //         this.authService.logout();
  //         return this.router.navigate(['verify-email']);
  //       }
  //       if (res.user.uid) {
  //         loading.dismiss();
  //         this.router.navigateByUrl('/tabs', { replaceUrl: true });
  //       }
  //     })
  //     .catch(async (error) => {
  //       loading.dismiss();
  //       const alert = await this.alertController.create({
  //         header: 'Login failed',
  //         message: error.message,
  //         buttons: ['OK'],
  //       });
  //       await alert.present();
  //     });
  // }
}
