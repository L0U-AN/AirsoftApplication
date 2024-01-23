import {
  Component,
  OnInit,
  AfterContentChecked,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { INTRO_KEY } from '../core/intro.guard';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, {
  Swiper,
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Virtual,
} from 'swiper';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IntroPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  public swiperConfig = {
    slidesPerView: 1,
    autoplat: true,
    keyboard: true,
    pagination: true,
    virtual: true,
  };
  constructor(private router: Router) {}


  ngOnInit() {
    SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Virtual]);
    console.log(this.swiper);
  }

  async start() {
    await Preferences.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
  prev() {
    this.swiper.swiperRef.slidePrev(100);
  }
  next() {
    this.swiper.swiperRef.slideNext(100);
  }
}
