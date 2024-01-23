import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { DataService } from '../services/data.service';
import { catchError, tap } from 'rxjs/operators';
import { switchMap, map } from 'rxjs/operators';
import firebase from 'firebase/compat/app'; // Import firebase for FieldValue

import { Chat } from './chat.model';
import { User } from './user.model'; // Add import for User model

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentUser: any; // Add a private currentUser property
  private users: User[] = [];
  constructor(
    private dataService: DataService,
    private afAuth: Auth,
    private afs: AngularFirestore,
    private firestore: AngularFirestore,
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
    this.dataService.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  getUserById(userId: string): Promise<any> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('uid', '==', userId))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log('Données de l\'utilisateur récupérées:', userData);
          return userData;
        } else {
          console.log('Aucune donnée d\'utilisateur trouvée pour l\'ID:', userId);
          return null;
        }
      });
  }


  createChat(userOneId: string, userTwoId: string): Promise<any> {
    // Générer l'identifiant de chat composé
    const chatId = [userOneId, userTwoId].sort().join('_');

    return this.afs.doc(`chats/${chatId}`).get().toPromise().then(docSnapshot => {
      if (docSnapshot.exists) {
        // Le chat existe déjà, retourner l'ID existant
        return chatId;
      } else {
        // Créer un nouveau chat
        return this.afs.collection('chats').doc(chatId).set({
          users: [userOneId, userTwoId],
          // autres propriétés du chat...
        }).then(() => chatId);
      }
    });
  }

  checkForExistingChat(userOneId: string, userTwoId: string): Promise<string | null> {
    return this.afs.collection('chats', ref => ref
      .where('users', 'array-contains', userOneId)
    ).get().toPromise().then(snapshot => {
      const foundChat = snapshot.docs.find(doc => {
        const chatData = doc.data() as Chat;
        return chatData.users.includes(userTwoId); // Utilisez 'includes' pour vérifier la présence de l'UID
      });

      if (foundChat) {
        return foundChat.id;
      }

      return null;
    });
  }

  getChat(chatId: string): Observable<Chat> {
    return this.afs.doc<Chat>(`chats/${chatId}`).valueChanges();
  }


  getChatsForCurrentUser(): Observable<any[]> {
    console.log('Début de getChatsForCurrentUser');
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté, retourne un Observable vide');
      return of([]);
    }
    console.log('Utilisateur connecté:', this.currentUser.uid);

    console.log('Exécution de la requête Firebase pour récupérer les chats');
    return this.afs
      .collection('chats', (ref) => ref.where('users', 'array-contains', this.currentUser.uid))
      .valueChanges({ idField: 'id' })
      .pipe(
        tap(chats => console.log('Chats récupérés:', chats)),
        catchError(error => {
          console.error('Erreur lors de la récupération des chats:', error);
          return of([]); // Retourne un Observable vide en cas d'erreur
        })
      );
  }


  getChatsForUser(userId: string): Observable<any[]> {
    return this.afs
      .collection('chats', (ref) => ref.where('participants', 'array-contains', this.currentUser.uid))
      .valueChanges({ idField: 'id' }) as Observable<any[]>;
  }

  addChatMessage(msg: string, chatId: string): Promise<any> {
    return this.afs.collection('chats').doc(chatId).collection('messages').add({
      msg,
      from: this.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }


  getChatMessages(chatId: string): Observable<Chat[]> {
    return this.dataService.getUsers().pipe(
      switchMap((res) => {
        this.users = res;
        return this.afs
          .collection('chats')
          .doc(chatId)
          .collection('messages', (ref) => ref.orderBy('createdAt'))
          .valueChanges({ idField: 'id' }) as Observable<Chat[]>;
      }),
      map((messages) => {
        messages.forEach(m => {
          if (m.createdAt && m.createdAt instanceof firebase.firestore.Timestamp) {
            // Convertir le Timestamp en objet Date
            m.createdAt = m.createdAt.toDate();
          }
        });
        return messages;
      })
    );
  }

  getOtherUserId(chatId: string, currentUserId: string): Promise<string | null> {
    return this.afs.doc(`chats/${chatId}`).get().toPromise().then(docSnapshot => {
      if (docSnapshot.exists) {
        const chatData = docSnapshot.data() as Chat;
        const otherUserId = chatData.users.find(uid => uid !== currentUserId);
        return otherUserId || null; // S'assurer que c'est un string
      } else {
        return null;
      }
    });
  }


  private getUserForMsg(msgFromId: string): string {
    const user = this.users.find((usr) => usr.uid === msgFromId);
    return user ? user.email || 'No email' : 'No email';
  }

  private getOtherUserEmail(chatId: string, currentUserId: string): string {
    const otherUserIds = chatId.split('_').filter(userId => userId !== currentUserId);
    const otherUser = this.users.find(user => user.uid === otherUserIds[0]);
    return otherUser ? otherUser.email || 'No email' : 'No email';
  }

}


