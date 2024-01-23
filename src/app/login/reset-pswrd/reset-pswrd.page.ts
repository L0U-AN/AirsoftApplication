import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-reset-pswrd',
  templateUrl: './reset-pswrd.page.html',
  styleUrls: ['./reset-pswrd.page.scss'],
})
export class ResetPswrdPage implements OnInit {

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

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async resetPassword() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.recoverPassword(this.credentials.value.email).then(
      async () => {
        loading.dismiss();
        // Ajouter l'alerte ici
        const alert = await this.alertController.create({
          header: 'Réinitialisation du mot de passe',
          message: 'Pour réinitialiser votre mot de passe, un e-mail a été envoyé à votre adresse mail.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['login']);
            }
          }],
        });
        await alert.present();
      },
      async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'La réinitialisation du mot de passe a échoué',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

}
