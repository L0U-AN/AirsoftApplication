import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Timestamp } from 'firebase/firestore';
import {
  Event,
  Terrain,
  Player,
} from 'src/app/services/events.model';
import { User } from 'src/app/services/user.model';

import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { EditModalComponent } from '../event-modal/edit-modal.component';
import { ConfModalComponent } from './terrain-modal/terrain-modal.component';

import { Router, NavigationExtras } from '@angular/router';

import { StatsModalComponent } from './stats-modal/stats-modal.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  loadedEvent: Event;
  loadedTerrain: Terrain;
  loadedPlayers: any[] = [];
  isDataAvailable = false;
  user: User;
  selectedSegment = 'event';
  searchTerm = '';

  isQrCodeModalOpen = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    //get the event id from the url
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('eventId')) {
        console.log('Event ID not found in paramMap');
        return;
      }
      const eventId = paramMap.get('eventId');
      console.log('Event ID:', eventId);
      this.dataService
        .getUser(this.authService.currentUser.uid)
        .subscribe(async (res) => {
          this.user = await res;
          console.log('User:', this.user);
        });

        this.dataService.getEvent(eventId).subscribe(async (eventRes) => {
          this.loadedEvent = await eventRes;
          console.log('Loaded Event:', this.loadedEvent);

          this.dataService.getTerrains(eventId).subscribe(async (terrainsRes) => {
            this.loadedEvent.terrains = await terrainsRes.sort((a, b) => a.availableFrom - b.availableFrom);
            console.log('Loaded Terrains:', this.loadedEvent.terrains);

            const playersPromises = this.loadedEvent.terrains.map(async (terrain) => {
              const  playersRes = await this.dataService.getPlayers(eventId, terrain.id).toPromise();
              console.log('Loaded  players for terrain', terrain.id, ':',  playersRes);
              return  playersRes;
            });
            this.loadedPlayers = await Promise.all(playersPromises);
            console.log('Loaded Players:', this.loadedPlayers);
            this.isDataAvailable = true;
          });
        });

    });
  }

  async showAlert(err: string) {
    const alert = await this.alertCtrl.create({
      message: err,
      buttons: ['OK'],
    });
    await alert.present();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    console.log('Selected Segment:', this.selectedSegment);
  }

  async deleteTerrain(terrain: Terrain) {
    const alert = await this.alertCtrl.create({
      message:
        'Etes vous sur de vouloir supprimer ce terrain ? \n Cette action est irréversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.dataService
              .deleteTerrain(this.loadedEvent.id, terrain.id)
              .then(() => {
                this.showAlert('Terrain deleted');
              });
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteEvent() {
    const alert = await this.alertCtrl.create({
      message:
        'Etes vous sur de vouloir supprimer cet événement ? \n Cette action est irréversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.dataService.deleteEvent(this.loadedEvent.id).then(() => {
              this.showAlert('Event deleted');
              this.router.navigateByUrl('/tabs/profile/my-events');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  creatTerrain() {
    this.modalCtrl
      .create({
        component: ConfModalComponent,
        componentProps: { modalType: 'create' },
      })
      .then(async (modal) => {
        modal.present();
        const { data, role } = await modal.onDidDismiss();
        if (role === 'confirm') {
          data.created = new Date();
          data.updated = new Date();
          this.dataService.addTerrain(this.loadedEvent.id, data).then(
            () => {
              this.showAlert('Event created');
            },
            (err) => {
              this.showAlert(err);
            }
          );
        }
      });
  }

  editTerrain(terrain: Terrain) {
    this.modalCtrl
      .create({
        component: ConfModalComponent,
        componentProps: { modalType: 'edit', terrain },
      })
      .then(async (modal) => {
        modal.present();
        const { data, role } = await modal.onDidDismiss();
        if (role === 'confirm') {
          data.updated = new Date();
          this.dataService
            .updateTerrain(this.loadedEvent.id, terrain.id, data)
            .then(
              () => {
                this.showAlert('Terrain updated');
              },
              (err) => {
                this.showAlert(err);
              }
            );
        }
      });
  }

  openEditModal() {
    this.modalCtrl
      .create({
        component: EditModalComponent,
        componentProps: {
          event: this.loadedEvent,
          user: this.user,
        },
      })
      .then(async (modal) => {
        modal.present();
        const { data, role } = await modal.onDidDismiss();

        if (role === 'confirm') {
          if (data.terrains) {
            delete data.terrains
          ;}
          data.updated = new Date();
          this.dataService.updateEvent(this.loadedEvent.id, data).then(
            () => {
              this.showAlert('Event created');
            },
            (err) => {
              this.showAlert(err);
            }
          );
        }
      });
  }


  openStatsModal(type: string) {
    this.modalCtrl
      .create({
        component: StatsModalComponent,
        componentProps: {
        type,
          event: this.loadedEvent,
          players: this.loadedPlayers,
        },
      })
      .then(async (modal) => {
        modal.present();
      });
  }

  terrainLoyality(terrain: Terrain) {
    const params: NavigationExtras = {
      queryParams: {
        eventId: this.loadedEvent.id,
        terrainId: terrain.id,
        uid: this.user[0].uid,
      },
    };
    this.router.navigate(['tabs/loyality'], params);
  }

  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
}
