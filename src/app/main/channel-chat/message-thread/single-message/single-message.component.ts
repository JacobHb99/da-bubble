import { Component, inject, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../services/user.service';
import { InterfaceService } from '../../../../services/interface.service';
import { Message, Reaction } from '../../../../models/message.model';
import { FirebaseService } from '../../../../services/firebase.service';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ReactionService } from '../../../../services/reaction.service';
import { BreakpointObserverService } from '../../../../services/breakpoint-observer.service';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule, PickerComponent, EmojiComponent],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  uiService = inject(InterfaceService);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);
  reactService = inject(ReactionService);

  messageIsMine: boolean = true;
  showReactionPopups: boolean = false; //nachsehen welche 
  showEmojiPicker = false;
  currentReaction = new Reaction();
  allReactions: Reaction[] = [];

  user: any;
  //currentMessage: Message = new Message();
  @Input() currentMessage: Message = new Message();
  @Input() message: Message = new Message();

  loggedInUser: any;



  constructor(
    private userDataService: UserDataService,
    public breakpointObserver: BreakpointObserverService
  ) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });
  }

  onMouseOver() {
    this.showReactionPopups = true;
  }

  onMouseLeave() {
    this.showReactionPopups = false;
  }

  ngOnInit(): void {
    //this.fiBaService.currentMsg = this.currentMessage
    this.currentMessage = new Message(this.currentMessage);
    this.loggedInUser = this.authService.currentUserSig();
    console.log(this.loggedInUser)
  }


  getFormattedDate(timestamp: number): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Wochentag ausgeschrieben (z.B. "Dienstag")
      day: 'numeric',  // Tag als Zahl (z.B. "14")
      month: 'long'    // Monat ausgeschrieben (z.B. "Januar")
    };
    return date.toLocaleDateString('de-DE', options);
  }

  getFormattedTime(timestamp: number): string {
    const time = new Date(timestamp);

    return time.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' Uhr';
  }

  findUserWithId(Id: unknown) {
    for (let i = 0; i < this.fiBaService.allUsers.length; i++) {
      let user: User = this.fiBaService.allUsers[i];

      if (Id === user.uid) {
        return user;
      }
    }
    return null;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  checkPlural(counter: number) {
    return counter > 1 ? 'haben reagiert' : 'hat reagiert';
  }

  manageEmoji(event: any) {
    const emoji = event.emoji;
    console.log('emoji', emoji)
    this.reactService.updateMessageWithReaction(emoji, this.currentMessage)
  }

  manageDeleteEmoji(reaction: any) {
    //const emoji = event.emoji;
    console.log('emoji', reaction)
    this.reactService.deleteEmoji(this.currentMessage)
  }

  // getReactedUsers(reactedUser: { [key: string]: boolean }): string[] {
  //   return Object.keys(reactedUser);
  // }

  // getReactedUserNames(reactedUser: object) {
  //   return Object.keys(reactedUser);   //wandelt object in ein array um
  // }

}
