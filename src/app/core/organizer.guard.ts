import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizerGuard implements CanLoad {
  user: User;
  isDataAvailable = false;
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  isOrganizer() {
    this.dataService
      .getUser(this.authService.currentUser.uid)
      .subscribe(async (res) => {
        this.user = await res;
        console.log(this.user);
        this.isDataAvailable = true;
      });
  }

  async canLoad(): Promise<boolean> {
    await this.isOrganizer();
    if (this.isDataAvailable) {
      console.log(this.user[0].isOrganizer);
      return this.user[0].isOrganizer;
    }
  }
}
