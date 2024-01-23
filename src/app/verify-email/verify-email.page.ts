import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  async sendVerificationMail() {
    console.log(this.authService);
    await this.authService.sendVerificationMail();
  }
}
