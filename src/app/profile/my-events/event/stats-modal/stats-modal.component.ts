// stats-modal.component.ts

import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DataService } from '../../../../services/data.service';
import { Terrain, Player, Event } from 'src/app/services/events.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-stats-modal',
  templateUrl: './stats-modal.component.html',
  styleUrls: ['./stats-modal.component.scss'],
})
  export class StatsModalComponent implements OnInit{

  type: string;
  event: Event;
  players: Player[];
  terrains: Terrain[];

  displayedPlayers: any[] = [];

  totalPlayers = 0;
  totalPresent = 0;
  totalAbsent = 0;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService
  ) {}

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    this.loadEventData();
  }

  loadEventData() {
    //this.resetData(); // Réinitialise les données avant de les recharger

    if (this.type === 'event') {
      this.terrains = this.event.terrains;

      for (const terrain of this.terrains) {
        this.totalPlayers += terrain.players.length;

        for (const playerId of terrain.players) {
          // Utilisez une souscription pour des mises à jour en temps réel
          this.dataService.getPlayerDetailsObservable(playerId).subscribe(playerDetails => {
            if (playerDetails) {
              const existingIndex = this.displayedPlayers.findIndex(p => p.uid === playerId);
              if (existingIndex !== -1) {
                // Mise à jour si le joueur existe déjà dans le tableau
                this.displayedPlayers[existingIndex] = { ...playerDetails, terrainId: terrain.id };
              } else {
                // Ajouter un nouveau joueur si non trouvé
                this.displayedPlayers.push({ ...playerDetails, terrainId: terrain.id });
              }
              this.updateAttendanceTotals();
            } else {
              console.log('Player not found for ID:', playerId);
            }
          });
        }
      }
    }
  }

  markAttendance(player: any, status: 'present' | 'absent') {
    const eventId = this.event.id;
    const terrainId = player.terrainId;

    this.dataService.updatePlayerAttendanceUsingUID(eventId, terrainId, player.uid, status)
      .then(() => {
        console.log(`Attendance status updated for player ${player.uid} to ${status}`);
        player.attendanceStatus = status;
        // Mettre à jour les totaux de présence et d'absence si nécessaire
        this.updateAttendanceTotals();
      })
      .catch(error => console.error('Error updating attendance status', error));
  }

  // Cette méthode peut être utilisée pour mettre à jour le nombre total de joueurs présents et absents
  updateAttendanceTotals() {
    this.totalPresent = this.displayedPlayers.filter(p => p.attendanceStatus === 'present').length;
    this.totalAbsent = this.displayedPlayers.filter(p => p.attendanceStatus === 'absent').length;
  }

}
