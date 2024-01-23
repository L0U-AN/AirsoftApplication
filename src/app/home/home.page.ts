import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/services/events.model';
import { User } from 'src/app/services/user.model';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Timestamp } from 'firebase/firestore';
import SwiperCore, {
  Swiper,
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Virtual,
} from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isDataAvailable = false;
  events: Event[] = [];
  user: User;
  userEvents: Event[] = [];
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.15,
    autoplay: true,
  };
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.getEvents().subscribe((res) => {
      this.events = res.sort(() => 0.5 - Math.random()).slice(0, 3);
    });

    this.dataService
      .getUser(this.authService.currentUser.uid)
      .subscribe(async (res) => {
        this.user = await res;
        this.isDataAvailable = true;
      });

    // Charge les événements de l'utilisateur
    this.dataService.getUserEvents().subscribe((userEvents) => {
      // Supposons que getUserEvents renvoie déjà les événements auxquels l'utilisateur est inscrit
      this.userEvents = userEvents;
    });
  }

  nav(eventId: string) {
    this.router.navigateByUrl('tabs/events/' + eventId);
  }


  isFavorite(event: Event) {
    return this.user[0].favoriteEvents.includes(event.id);
  }

  onFavorite(event: Event) {
    this.dataService.addFavoriteEvent(this.user[0], event.id);
  }


  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
}
