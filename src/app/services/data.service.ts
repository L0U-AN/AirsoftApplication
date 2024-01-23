import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { of, from,Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { User } from './user.model';
import { OrganizerRequest } from './organizer-request.model';
import { ManagerRequest } from './manager-request.model';
import { Company } from './company.model';
import { Event,Terrain, Player, PlayerDetails } from './events.model';
import { TerrainOfficial } from './terrain-official.model';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private firestore: AngularFirestore,
    private auth: Auth,
    private authService: AuthService
  ) {}

  //users functions here
  getUsers(): Observable<any[]> {
    return this.firestore
      .collection<User>('users')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as User;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }

  getUser(uid: string): Observable<any> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('uid', '==', uid))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as User;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }

  getUserByEmail(email: string): Promise<any> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise();
  }

  getUserById(userId: string): Promise<any> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('uid', '==', userId))
      .get()
      .toPromise();
  }

  addUser(user: User) {
    return this.firestore.collection<User>('users').add(user);
  }

  updateUser(user: User) {
    return this.firestore.collection('users').doc(user.docId).update(user);
  }


  addFavoriteEvent(user: User, eventId: string) {
    if (!user.favoriteEvents.includes(eventId)) {
      this.firestore
        .collection('users')
        .doc(user.docId)
        .update({
          favoriteEvents: arrayUnion(eventId),
        });
    } else {
      this.firestore
        .collection('users')
        .doc(user.docId)
        .update({
          favoriteEvents: arrayRemove(eventId),
        });
    }
  }

  getUserEvents(): Observable<Event[]> {
    const userId = this.authService.currentUser.uid;
    const userEvents: Event[] = [];

    return this.firestore.collection<Event>('events').snapshotChanges().pipe(
        switchMap(eventsSnapshot => {
            const eventObservables = eventsSnapshot.map(eventSnapshot => {
                const eventId = eventSnapshot.payload.doc.id;

                // Requête pour vérifier si l'utilisateur est inscrit à un terrain de cet événement
                return this.firestore.collection<Event>('events').doc(eventId)
                    .collection<Terrain>('terrains', ref => ref.where('players', 'array-contains', userId))
                    .get().pipe(
                        map(terrainsSnapshot => {
                            if (!terrainsSnapshot.empty) {
                                // L'utilisateur est inscrit à au moins un terrain de cet événement
                                return { ...eventSnapshot.payload.doc.data(), id: eventId } as Event;
                            }
                            return null;
                        })
                    );
            });

            // Combinez tous les observables d'événements pour obtenir un tableau d'événements
            return forkJoin(eventObservables).pipe(
                map(events => events.filter(event => event !== null))
            );
        }),
        map(filteredEvents => filteredEvents as Event[])
    );
}
  //events functions here

  //get all events
  getEvents(): Observable<any[]> {
    return this.firestore
      .collection('events')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Event;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  //get event by id
  getEvent(eventId: string): Observable<any> {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .valueChanges()
      .pipe(
        map((actions) => {
          const data = actions as Event;
          const id = eventId;
          return { id, ...data };
        })
      );
  }

  //add event
  addEvent(event: Event) {
    return this.firestore.collection('events').add(event);
  }

  deleteEvent(eventId: string) {
    return this.firestore.collection('events').doc(eventId).delete();
  }

  //update event
  updateEvent(eventId: string, event: Event) {
    return this.firestore.collection('events').doc(eventId).update(event);
  }

  //terrains functions here
  //get all terrains
  getTerrains(eventId: string): Observable<any> {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .collection<Terrain>('terrains')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Terrain;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  //get terrain by id
  getTerrain(eventId: string, terrainId: string): Observable<any> {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .collection<Terrain>('terrains')
      .doc(terrainId)
      .valueChanges()
      .pipe(
        tap((data) => console.log('Terrains data:', data)),
        map((actions) => {
          const data = actions as Terrain;
          const id = terrainId;
          return { id, ...data };
        })
      );
  }

  //add terrain
  addTerrain(eventId: string, terrain: Terrain) {
    console.log('Adding terrain:', terrain);
    return this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .add(terrain)
      .catch((error) => {
        console.error('Error adding terrain:', error);
      });
  }

  //update terrain
  updateTerrain(
    eventId: string,
    terrainId: string,
    terrain: Terrain
  ) {
    console.log('Updating terrain:', terrain);
    return this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .update(terrain)
      .catch((error) => {
        console.error('Error updating terrain:', error);
      });
  }

  //delete terrain
  deleteTerrain(eventId: string, terrainId: string) {
    console.log('Deleting terrain:', terrainId);
    return this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .delete()
      .catch((error) => {
        console.error('Error deleting terrain:', error);
      });
  }

  getPlayers(eventId: string, terrainId: string) {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .collection<Terrain>('terrains')
      .doc(terrainId)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map((actions) => ({
          id: terrainId,
          player: actions.map((a) => {
            const data = a.payload.doc.data() as Player;
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        }))
      );
}

  getPlayer(eventId: string, terrainId: string, playerId: string) {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .collection<Terrain>('terrains')
      .doc(terrainId)
      .collection('players')
      .doc(playerId)
      .valueChanges()
      .pipe(
        map((actions) => {
          const data = actions as Player;
          const id = playerId;
          return { id, ...data };
        })
      );
  }

  getPlayerByUid(eventId: string, terrainId: string, uid: string) {
    return this.firestore
      .collection<Event>('events')
      .doc(eventId)
      .collection<Terrain>('terrains')
      .doc(terrainId)
      .get()
      .pipe(
        map((terrainDoc) => {
          const terrainData = terrainDoc.data();
          const players = terrainData.players || [];

          const playerExists = players.includes(uid);

          return {
            id: terrainId,
            player: playerExists ? [{ id: terrainId }] : [], // Retourne un tableau avec un objet si le joueur existe, sinon un tableau vide
          };
        })
      );
  }

  getPlayerDetailsByUid(uid: string): Promise<PlayerDetails | null> {
    return this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as User;
          return {
            uid: userData.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          };
        } else {
          return null;
        }
      });
  }

  getPlayerDetailsObservable(uid: string): Observable<PlayerDetails | null> {
    return this.firestore.collection('users', ref => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(
        map(docs => {
          if (docs.length > 0) {
            return docs[0] as PlayerDetails;
          } else {
            return null;
          }
        })
      );
  }

  addPlayer(
    eventId: string,
    terrainId: string,
    player: Player
  ) {
    return this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .collection('players')
      .add(player);
  }

/*  updatePlayer(
    eventId: string,
    terrainId: string,
    playerId: string,
    player: Player
  ) {
    return this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .collection('players')
      .doc(playerId)
      .update(player);
  }*/

  updatePlayer(
    eventId: string,
    terrainId: string,
    playerId: string,
    player: Player
) {
    const playerDoc = this.firestore
        .collection('events')
        .doc(eventId)
        .collection('terrains')
        .doc(terrainId)
        .collection('players')
        .doc(playerId);

    playerDoc.get().subscribe(doc => {
        if (doc.exists) {
            // Le document existe, effectuez la mise à jour
            playerDoc.update(player);
        } else {
            console.error('Le document du joueur n\'existe pas.');
        }
    });
}


async bookTerrain(
  eventId: string,
  terrainId: string,
  userId: string,
  terrain: Terrain,
  player: Player
) {
  if (!player) {
    this.addPlayer(eventId, terrainId, {
      uid: userId,
      status: true,
      attendanceStatus: 'absent',
      created: new Date(),
      updated: new Date(),
      checkedIn: false,
    });
      return this.firestore
        .collection('events')
        .doc(eventId)
        .collection('terrains')
        .doc(terrainId)
        .update({
          players: arrayUnion(userId),
        });
    }
  if (terrain.players.includes(userId)) {
    this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .update({
        players: arrayRemove(userId),
      });
    this.updatePlayer(eventId, terrainId, player.id, {
      ...player,
      status: false,
      updated: new Date(),
    });
  } else {
    this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId)
      .update({
        players: arrayUnion(userId),
      });
    this.updatePlayer(eventId, terrainId, player.id, {
      ...player,
      status: true,
      updated: new Date(),
    });
  }
}

async cancelBooking(eventId: string, terrainId: string, userId: string): Promise<void> {
  const terrainDoc = this.firestore
      .collection('events')
      .doc(eventId)
      .collection('terrains')
      .doc(terrainId);

  try {
      const terrainSnapshot = await terrainDoc.get().toPromise();
      if (terrainSnapshot.exists) {
          const terrainData = terrainSnapshot.data() as Terrain;

          // Vérifier si l'utilisateur est déjà dans la liste des joueurs
          if (terrainData.players.includes(userId)) {
              // Supprimer l'utilisateur de la liste des joueurs
              await terrainDoc.update({
                  players: arrayRemove(userId)
              });

              // Mettre à jour les données du joueur
              await this.updatePlayer(eventId, terrainId, userId, {
                uid: userId,
                status: true,
                created: new Date(),
                updated: new Date(),
                checkedIn: false,
              });
          } else {
              console.error('User not found in the players list');
          }
      } else {
          console.error('Terrain not found');
      }
  } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
  }
}

async updatePlayerAttendanceUsingUID(
  eventId: string, terrainId: string, playerUID: string, attendanceStatus: 'present' | 'absent'): Promise<void> {
    console.log(`Updating attendance for Event ID: ${eventId}, Terrain ID: ${terrainId}, Player UID: ${playerUID}`);
  const playersCollectionRef = this.firestore.collection(`events/${eventId}/terrains/${terrainId}/players`);

  try {
    const querySnapshot = await playersCollectionRef.ref.where('uid', '==', playerUID).get();

    if (!querySnapshot.empty) {
      const playerDocRef = querySnapshot.docs[0].ref;
      await playerDocRef.update({ attendanceStatus });
      console.log('Attendance status updated successfully');
    } else {
      console.error('No matching player document found');
    }
  } catch (error) {
    console.error('Error updating attendance status:', error);
  }
}







  //organizer request
  addOrganizerRequest(organizerRequest: OrganizerRequest) {
    return this.firestore.collection('tickets').add(organizerRequest);
  }

  //get organizer request
  getOrganizerRequests() {
    return this.firestore
      .collection<OrganizerRequest>('tickets')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as OrganizerRequest;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }

  getTicketById(ticketId: string): Observable<any> {
    return this.firestore
      .collection('tickets')
      .doc(ticketId)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const data = actions.payload.data() as OrganizerRequest;
          const docId = actions.payload.id;
          return { docId, ...data };
        })
      );
  }

  getPendingTickets() {
    return this.firestore
      .collection('tickets', (ref) => ref.where('status', '==', 'PENDING'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as OrganizerRequest;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }

  changeTicketStatus(ticketId: string, status: string) {
    const updateAt = new Date();
    return this.firestore
      .collection('tickets')
      .doc(ticketId)
      .update({ status, updateAt });
  }

  updateTicket(ticketId: string, ticket: OrganizerRequest) {
    ticket.updatedAt = new Date();
    return this.firestore.collection('tickets').doc(ticketId).update(ticket);
  }

  getTerrainOfficialByNumber(companyNumber: string) {
    return this.firestore
      .collection('officialTerrain', (ref) => ref.where('number', '==', companyNumber))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as TerrainOfficial;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }

  getTerrainOfficialById(docId: string): Promise<any> {
    return this.firestore.collection('officialTerrain').doc(docId).get().toPromise();
  }

  addTerrainOfficial(terrain: TerrainOfficial) {
    // Omettre le champ terrainId, laissez Firebase le générer
    const { terrainId, ...terrainData } = terrain;

    // Utiliser la méthode add de Firebase pour générer terrainId
    return this.firestore.collection('officialTerrain').add(terrainData);
}

  updateTerrainOfficial(docId: string, company: TerrainOfficial) {
    return this.firestore.collection('officialTerrain').doc(docId).update(company);
  }

    // Shop Manager Request
    addManagerRequest(managerRequest: ManagerRequest) {
      return this.firestore.collection('managerTickets').add(managerRequest);
    }

    //get organizer request
    getManagerRequests() {
      return this.firestore
        .collection<ManagerRequest>('managerTickets')
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as ManagerRequest;
              const docId = a.payload.doc.id;
              return { docId, ...data };
            })
          )
        );
    }

    getManagerTicketById(managerTicketId: string): Observable<any> {
      return this.firestore
        .collection('managerTickets')
        .doc(managerTicketId)
        .snapshotChanges()
        .pipe(
          map((actions) => {
            const data = actions.payload.data() as ManagerRequest;
            const docId = actions.payload.id;
            return { docId, ...data };
          })
        );
    }

    getManagerPendingTickets() {
      return this.firestore
        .collection('managerTickets', (ref) => ref.where('status', '==', 'PENDING'))
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as ManagerRequest;
              const docId = a.payload.doc.id;
              return { docId, ...data };
            })
          )
        );
    }

    changeManagerTicketStatus(managerTicketId: string, status: string) {
      const updateAt = new Date();
      return this.firestore
        .collection('managerTickets')
        .doc(managerTicketId)
        .update({ status, updateAt });
    }

    updateManagerTicket(managerTicketId: string, managerTicket: ManagerRequest) {
      managerTicket.updatedAt = new Date();
      return this.firestore.collection('managerTickets').doc(managerTicketId).update(managerTicket);
    }

    getCompanyByNumber(companyNumber: string) {
      return this.firestore
        .collection('companies', (ref) => ref.where('number', '==', companyNumber))
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Company;
              const docId = a.payload.doc.id;
              return { docId, ...data };
            })
          )
        );
    }

    getCompanyById(docId: string): Promise<any> {
      return this.firestore.collection('companies').doc(docId).get().toPromise();
    }

    addCompany(company: Company) {
      const {companyId, ...companyData} = company;
      return this.firestore.collection('companies').add(company);
    }


    updateCompany(docId: string, company: Company) {
      return this.firestore.collection('companies').doc(docId).update(company);
    }

}




