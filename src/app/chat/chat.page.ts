import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  currentChatId: string;
  currentUserUid: string;
  otherUserEmail: string;
  currentUserEmail: string;

  constructor(
    private chatService: ChatService,
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.currentUserAsync().then(firebaseUser => {
      if (firebaseUser) {
        this.currentUserUid = firebaseUser.uid;
        this.currentUserEmail = firebaseUser.email || '';
        this.route.params.subscribe(params => {
          this.currentChatId = params.chatId;
          this.selectChat(this.currentChatId);
        });
      }
    });
  }

  selectChat(chatId: string) {
    this.messages = this.chatService.getChatMessages(chatId).pipe(
      map(messages => messages.map(message => ({
        ...message,
        myMsg: message.from === this.currentUserUid
      })))
    );

    this.chatService.getChat(chatId).subscribe(chat => {
      const otherUserId = chat.users.find(uid => uid !== this.currentUserUid);
      this.chatService.getUserById(otherUserId).then(user => {
        this.otherUserEmail = (user as User).email;
      });
    });
  }


  sendMessage() {
    if (this.newMsg.trim() === '') {
      return;
    }

    this.chatService.addChatMessage(this.newMsg, this.currentChatId).then(() => {
      this.newMsg = '';
      this.scrollToBottom();
    });
  }

  private scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 100);
  }

}
