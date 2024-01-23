// statistics.service.ts

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Event, Player, Terrain } from './events.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private dataService: DataService) {}

  getEventStats(loadedEvent: Event): { totalPlayers: number; playerNames: string[] } {
    let totalPlayers = 0;
    const playerNames: string[] = [];

    if (loadedEvent && loadedEvent.terrains) {
      for (const terrain of loadedEvent.terrains) {
        totalPlayers += Math.floor(terrain.players.length);

        for (const playerId of terrain.players) {
          // Utilisez l'ID du joueur pour extraire le nom du joueur
          const playerName = playerId;
          playerNames.push(playerName);
        }
      }
    }

    return { totalPlayers, playerNames };
  }
  
  
}
