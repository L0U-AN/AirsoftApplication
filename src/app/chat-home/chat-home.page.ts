import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService  } from '../services/auth.service';
import { User } from '../services/user.model';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.page.html',
  styleUrls: ['./chat-home.page.scss'],
})
export class ChatHomePage {

  chatList: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}

  get chatListDebug() {
    console.log('chatList:', this.chatList);
    return this.chatList;
  }

  /* async ionViewWillEnter() {
    console.log('ionViewWillEnter - Chargement des chats pour l\'utilisateur actuel');

    try {
        console.log('Tentative de récupération des chats pour l\'utilisateur actuel');
        const currentUser = this.authService.currentUser;
        if (!currentUser) {
            console.error('Utilisateur actuel non défini');
            return;
        }

        const chats = await this.chatService.getChatsForCurrentUser().toPromise();
        console.log('Chats récupérés:', chats);

        if (chats.length === 0) {
            console.log('Aucun chat trouvé pour cet utilisateur.');
            return;
        }

// ... (le début de votre méthode ionViewWillEnter reste inchangé)
console.log('Début du traitement de chaque chat');
this.chatList = await Promise.all(chats.map(async (chat) => {
  console.log('Traitement du chat:', chat.id);
  const otherUserId = chat.users.find(uid => uid !== currentUser.uid);
  console.log('Autre utilisateur ID:', otherUserId, 'pour le chat:', chat.id);

  if (!otherUserId) {
      console.error('Aucun autre utilisateur ID trouvé pour le chat:', chat.id);
      return chat;
  }

  try {
      console.log('Tentative de récupération des informations pour l\'autre utilisateur', otherUserId);
      const otherUser = await this.dataService.getUserById(otherUserId);
      console.log('Informations sur l\'autre utilisateur récupérées:', otherUser);
      if (!otherUser) {
          console.error('Aucune information trouvée pour l\'autre utilisateur:', otherUserId);
          return { ...chat, otherUserEmail: 'No email' };
      }
      return { ...chat, otherUserEmail: otherUser?.email || 'No email' };
  } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'autre utilisateur:', error);
      return chat;
  }
}));

console.log('Liste des chats mise à jour:', this.chatList);

    } catch (error) {
        console.error('Erreur lors du chargement des chats:', error);
    }

    this.dataService.getUsers().subscribe((users) => {
        console.log('Liste des utilisateurs chargée:', users);
        this.users = users;
    });
}*/


async ionViewWillEnter() {
  console.log('ionViewWillEnter - Chargement des chats pour l\'utilisateur actuel');

  //const testUserId = '43k7O8oGSfYrAv67HFFkF0SFilu1'; // Remplacez par un ID utilisateur valide pour le test
   // this.chatService.getUserById(testUserId).then(userData => {
     //   console.log('Test - Données de l\'utilisateur:', userData);
   // });

  try {
      const currentUser = this.authService.currentUser;
      if (!currentUser) {
          console.error('Utilisateur actuel non défini');
          return;
      }

      this.chatService.getChatsForCurrentUser().subscribe(async chats => {
          const tempChatList = [];
          for (const chat of chats) {
              const otherUserId = chat.users.find(uid => uid !== currentUser.uid);
              if (!otherUserId) {
                  continue; // Passer au chat suivant si aucun autre utilisateur n'est trouvé
              }

              try {
                  // Utilisation directe de await avec la Promise retournée
                  const otherUserDoc = await this.chatService.getUserById(otherUserId);
                  const otherUserEmail = otherUserDoc?.email || 'No email found';
                  // Utilisation de la notation raccourcie pour l'objet
                  tempChatList.push({ id: chat.id, otherUserEmail });
              } catch (error) {
                  console.error('Erreur lors de la récupération des informations de l\'autre utilisateur:', error);
                  tempChatList.push({ id: chat.id, otherUserEmail: 'Error retrieving email' });
              }
          }

          this.chatList = tempChatList;
          console.log('Liste des chats mise à jour:', this.chatList);
      });
  } catch (error) {
      console.error('Erreur lors du chargement des chats:', error);
  }
}


















  searchUsers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Recherche d\'utilisateurs avec le terme:', searchTerm);
    if (searchTerm.trim() !== '') {
      this.dataService.getUserByEmail(searchTerm).then(querySnapshot => {
        this.filteredUsers = querySnapshot.docs.map(doc => {
          console.log('Utilisateur trouvé:', doc.data());
          return doc.data();
        });
      });
    } else {
      this.filteredUsers = [];
      console.log('Aucun terme de recherche, liste filtrée réinitialisée');
    }
  }

  openOrStartChat(user: User) {
    const currentUserId = this.authService.currentUser?.uid;
    console.log('Ouverture ou création d\'un chat avec l\'utilisateur:', user.email);

    if (!currentUserId) {
      console.error('Utilisateur actuel non défini');
      return;
    }

    this.chatService.checkForExistingChat(currentUserId, user.uid)
      .then(chatId => {
        console.log('Chat ID trouvé:', chatId);
        if (chatId) {
          this.router.navigate(['/chat', chatId]);
        } else {
          this.chatService.createChat(currentUserId, user.uid).then(newChatId => {
            console.log('Nouveau chat créé avec ID:', newChatId);
            this.router.navigate(['/chat', newChatId]);
          });
        }
      });
  }
}



























