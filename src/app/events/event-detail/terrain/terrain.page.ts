import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

import { DataService } from 'src/app/services/data.service';
import {
  Event,
  Terrain,
  Player,
} from 'src/app/services/events.model';
import { TerrainOfficial} from 'src/app/services/terrain-official.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.page.html',
  styleUrls: ['./terrain.page.scss'],
})
export class TerrainPage implements OnInit {

  loadedTerrain: Terrain;
  loadedEvent: Event;
  isDataAvailable = false;
  loadedPlayer: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isDataAvailable = false;
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('eventId') || !paramMap.has('terrainId')) {
        // redirect
        return;
      }
      const eventId = paramMap.get('eventId');
      const terrainId = paramMap.get('terrainId');

      this.dataService.getEvent(eventId).subscribe(async (resEvent) => {
        this.loadedEvent = await resEvent;
        this.dataService
          .getTerrain(eventId, terrainId)
          .subscribe(async (resTerrain) => {
            this.loadedTerrain = await resTerrain;
            const x = [];
            this.dataService
              .getPlayerByUid(
                eventId,
                terrainId,
                this.authService.currentUser.uid
              )
              .subscribe(async (resPlayer) => {
                console.log('resPlayer:', resPlayer); // Ajoutez cette ligne pour afficher resPlayer dans la console
                x.push(resPlayer);
                this.loadedPlayer = x;
              });

            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          });
      });
    });
  }


  // calculate attendance level at this conference
  getAttendanceLevel() {
    if (this.loadedTerrain) {
      const participants = this.loadedTerrain.players.length;
      const capacity = this.loadedTerrain.capacity;
      const attendanceLevel = participants / capacity;
      return attendanceLevel;
    }
  }

/*  getAttendanceColor() {
    const attendanceLevel = this.getAttendanceLevel();
    if (attendanceLevel < 0.5) {
      return 'success';
    } else if (attendanceLevel < 0.8) {
      return 'warning';
    } else {
      return 'danger';
    }
  }
*/
  isPlayers() {
    if (!this.loadedEvent) {
      return false;
    }
    return this.loadedTerrain.players.includes(
      this.authService.currentUser.uid
    );
  }

  setBookedTerrain() {
    const foundPlayer = this.loadedPlayer.find((p) => p.id === this.loadedTerrain.id);

    console.log('foundPlayer:', foundPlayer);

    if (foundPlayer && foundPlayer.player && foundPlayer.player.length > 0) {
      const player = foundPlayer.player[0];

      console.log('player:', player);

      if (player && player.id) {
        this.dataService.bookTerrain(
          this.loadedEvent.id,
          this.loadedTerrain.id,
          this.authService.currentUser.uid,
          this.loadedTerrain,
          player
        );
      } else {
        console.error('Erreur : player.id non défini.');
      }
    } else {
      console.error('Erreur : propriété player non définie ou tableau vide.');
    }
  }

  formatTimestampDate(timestamp: Timestamp | Date): string {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
}
