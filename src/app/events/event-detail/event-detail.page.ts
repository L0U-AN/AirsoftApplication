import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Event, Player, Terrain } from 'src/app/services/events.model';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/services/user.model';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  loadedEvent: Event;
  loadedTerrain: Terrain;
  isDataAvailable = false;
  player: Player;
  user: User;
  searchTerm = '';
  loadedPlayers: any = [];
  totalPlayers = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loadedPlayers = [];
    this.isDataAvailable = false;
    await this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('eventId')) {
        // redirect
        return;
      }
      const eventId = paramMap.get('eventId');

      this.dataService
        .getUser(this.authService.currentUser.uid)
        .subscribe(async (res) => {
          this.user = await res;

          this.dataService.getEvent(eventId).subscribe(async (eventRes) => {
            this.loadedEvent = await eventRes;
            console.log('Loaded Event:', this.loadedEvent);
            this.dataService.getTerrains(eventId).subscribe(async (terrainRes) => {
              this.loadedEvent.terrains = (await terrainRes).sort((a, b) => a.availableFrom - b.availableFrom);
              console.log('Loaded Terrains:', this.loadedEvent.terrains);
              const x = [];
              this.totalPlayers = 0;
              for (const c of this.loadedEvent.terrains) {
                this.totalPlayers += Math.floor(c.players.length);
                const playerRes = await this.dataService
                  .getPlayerByUid(eventId, c.id, this.user[0].uid)
                  .toPromise(); // Utilisez toPromise pour convertir l'observable en promesse
                x.push(playerRes);
              }
              this.loadedPlayers = x;
              this.isDataAvailable = true;
            });
          });
        });
    });
  }

  setBookedTerrain(terrainId: string) {
    this.dataService.bookTerrain(
      this.loadedEvent.id,
      terrainId,
      this.authService.currentUser.uid,
      this.loadedEvent.terrains.find((c) => c.id === terrainId),
      this.loadedPlayers.find((p) => p.id === terrainId).player[0]
    ).then(() => {
      this.presentAlert();
    });
  }

  cancelBooking(terrainId: string) {
    this.dataService.cancelBooking(
        this.loadedEvent.id,
        terrainId,
        this.authService.currentUser.uid
    ).then(() => {
        // Vous pouvez ajouter ici toute logique supplémentaire nécessaire après la désinscription
        console.log('Booking cancelled successfully');
        // Mettre à jour la liste des joueurs inscrits
        this.updateLoadedPlayers(terrainId, this.authService.currentUser.uid, false);
    }).catch(error => {
        console.error('Error cancelling booking:', error);
    });
}

async presentAlert() {
  const alert = await this.alertController.create({
    header: 'Inscription réussie',
    message: 'Vous êtes bien inscrit. Pour se désincrire, il faut le faire 48h avant la date de début de la partie.',
    buttons: ['OK']
  });

  await alert.present();
}

updateLoadedPlayers(terrainId: string, userId: string, add: boolean) {
  const terrainIndex = this.loadedEvent.terrains.findIndex(terrain => terrain.id === terrainId);
  if (terrainIndex > -1) {
      if (add) {
          this.loadedEvent.terrains[terrainIndex].players.push(userId);
      } else {
          // Diviser la ligne longue en plusieurs lignes plus courtes
          const updatedPlayers = this.loadedEvent.terrains[terrainIndex].players.filter(playerId => playerId !== userId);
          this.loadedEvent.terrains[terrainIndex].players = updatedPlayers;
      }
  }
}



  isPlayers(terrainId: string): boolean {
    if (!this.loadedEvent || !this.loadedEvent.terrains) {
      return false;
    }
    const terrain = this.loadedEvent.terrains.find((t) => t.id === terrainId);
    if (!terrain) {
      return false;
    }
    return terrain.players.includes(this.authService.currentUser.uid);
  }



  isFavorite() {
    return this.user[0].favoriteEvents.includes(this.loadedEvent.id);
  }

  onFavorite() {
    this.dataService.addFavoriteEvent(this.user[0], this.loadedEvent.id);
  }

  redirectToTerrainPage() {
    // Récupérez l'ID du terrain associé à l'événement (assurez-vous d'adapter cela en fonction de votre modèle de données)
    const terrainId = this.loadedEvent.terrainId;

    // Redirigez vers la page descriptive du terrain avec l'ID du terrain
    this.navCtrl.navigateForward(`/terrain/${terrainId}`);
  }

  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }

}
