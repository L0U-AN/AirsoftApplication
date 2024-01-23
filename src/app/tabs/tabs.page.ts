import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import {
  NavigationExtras,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { Terrain, Event } from '../services/events.model';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  user: User;
  isDataAvailable = false;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.dataService
      .getUser(this.authService.currentUser.uid)
      .subscribe(async (res) => {
        if (!res.length) {
          await this.dataService.addUser({
            uid: this.authService.currentUser.uid,
            role: 'USER',
            displayName: this.authService.currentUser.displayName,
            email: this.authService.currentUser.email,
            photoURL: this.authService.currentUser.photoURL,
            favoriteEvents: [],
            isOrganizer: false,
            isManager: false,
          });
        }
        this.user = await res;
        this.isDataAvailable = true;
      });
  }

}
