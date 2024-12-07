import { ChangeDetectorRef, Component, inject, input, Input } from '@angular/core';
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
  @Input() index: number = 0;
  @Input() isThread: boolean = false;

  loggedInUser: any;



  constructor(
    private userDataService: UserDataService,
    public breakpointObserver: BreakpointObserverService,
    private cdr: ChangeDetectorRef,
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

  openThread() {
    this.uiService.openThread()
    this.cdr.detectChanges();  // Erzwingt eine erneute Change Detection
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

  shouldShowDateDivider(index: number): boolean {

    if (index === 0) {
      this.uiService.previousMessage = this.currentMessage
      // Zeige immer einen Divider bei der ersten Nachricht
      return true;
    } else {
      const currentDate = this.getFormattedDate(this.currentMessage.timeStamp);
      const previousDate = this.getFormattedDate(this.uiService.previousMessage.timeStamp);
      this.uiService.previousMessage = this.currentMessage;
      // Zeige den Divider nur, wenn sich das Datum geändert hat
      return currentDate !== previousDate;
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  checkPlural(reaction: Reaction) {
    const hasReacted = Object.keys(reaction.reactedUser).some(
      (username) => username === this.authService.currentUserSig()?.username
    );
    if (reaction.counter > 1) {
      return 'haben reagiert';
    } else {
      return hasReacted ? 'hast reagiert' : 'hat reagiert';
    }
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

  async editMessage(currentMessage: Message) {
    // const msgId = currentMessage.msgId;
    // const ref = await this.fiBaService.getMsgRefById(msgId);

    // if (!ref) {
    //   console.error('Reference path not found for the given message.');
    //   return;
    // }
    // const conversationData = await this.fiBaService.getDataFromRef(ref)
    // if (conversationData) {
    //   const messages = conversationData['messages'];
    //   const message = this.fiBaService.getMessageData(conversationData, msgId);
    //   this.handleEditMsg(message);

    //   const dataRef = this.fiBaService.getDocWithRef(ref)
    //   this.fiBaService.updateMessageInFirestore(dataRef, messages);
    // }
  }

  handleEditMsg(message:any){}

}
