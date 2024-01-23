import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/services/events.model';
import { User } from 'src/app/services/user.model';

import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  isDataAvailable = false;
  events: Event[] = [];
  user: User;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.getUser(this.authService.currentUser.uid).subscribe(userRes => {
      this.user = userRes;
      this.dataService.getEvents().subscribe(eventsRes => {
        this.events = eventsRes.filter(event => this.user[0].favoriteEvents.includes(event.id));
      });
    });
  }

    //filter favorite events


  nav(eventId: string) {
    this.router.navigateByUrl('tabs/events/' + eventId);
  }

  handleRefresh(refreshEvent: any) {
    setTimeout(() => {
      this.dataService.getEvents().subscribe((res) => {
        this.events = res.filter((eventItem) => this.user[0].favoriteEvents.includes(eventItem.id));
      });
      refreshEvent.target.complete();
    }, 1000);
  }

  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
}

