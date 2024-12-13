import { ChangeDetectorRef, Component, inject, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule, PickerComponent, EmojiComponent, FormsModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  uiService = inject(InterfaceService);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);
  reactService = inject(ReactionService);

  showReactionPopups: boolean = false;
  showEmojiPicker = false;
  showEditPopup = false;
  editMode = false;
  editText = '';
  loggedInUser: any;
  user: any;

  @Input() currentMessage: Message = new Message();
  @Input() message: Message = new Message();
  @Input() index: number = 0;
  @Input() isThread: boolean = false;
  @ViewChild('emojiPicker', { static: false }) emojiPicker!: ElementRef;
  @ViewChild('editPopup', { static: false }) editPopup!: ElementRef;


  constructor(
    private userDataService: UserDataService,
    public breakpointObserver: BreakpointObserverService,
    private cdr: ChangeDetectorRef,
  ) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Zeigt das Reaktions-Popup an, wenn die Maus über das Element bewegt wird.
   */
  onMouseOver() {
    this.showReactionPopups = true;
  }

  /**
   * Zeigt das Reaktions-Popup an, wenn die Maus über das Element bewegt wird.
   */
  onMouseLeave() {
    this.showReactionPopups = false;
  }

  /**
   * Initialisiert die Komponente, indem die aktuelle Nachricht und der eingeloggte Benutzer gesetzt werden.
   */
  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
    this.loggedInUser = this.authService.currentUserSig();
  }

  /**
   * Öffnet einen Thread und erzwingt eine erneute Change Detection.
   */
  openThread() {
    this.uiService.openThread()
    this.cdr.detectChanges();
  }

  /**
   * Formatiert einen Zeitstempel in ein deutsches Datum im Format "Wochentag, Tag. Monat".
   * 
   * @param {number} timestamp - Der zu formatierende Zeitstempel.
   * @returns {string} - Das formatierte Datum.
   */
  getFormattedDate(timestamp: number): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('de-DE', options);
  }

  /**
   * Formatiert einen Zeitstempel in eine deutsche Uhrzeit im Format "HH:MM Uhr".
   * 
   * @param {number} timestamp - Der zu formatierende Zeitstempel.
   * @returns {string} - Die formatierte Uhrzeit.
   */
  getFormattedTime(timestamp: number): string {
    const time = new Date(timestamp);

    return time.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' Uhr';
  }

  /**
   * Findet einen Benutzer basierend auf seiner ID.
   * 
   * @param {unknown} Id - Die Benutzer-ID, nach der gesucht wird.
   * @returns {User | null} - Der gefundene Benutzer oder `null`, wenn kein Benutzer gefunden wurde.
   */
  findUserWithId(Id: unknown) {
    for (let i = 0; i < this.fiBaService.allUsers.length; i++) {
      let user: User = this.fiBaService.allUsers[i];

      if (Id === user.uid) {
        return user;
      }
    }
    return null;
  }

  /**
   * Bestimmt, ob ein Datums-Trenner angezeigt werden soll.
   * 
   * @param {number} index - Der Index der aktuellen Nachricht.
   * @returns {boolean} - `true`, wenn ein Trenner angezeigt werden soll, ansonsten `false`.
   */
  shouldShowDateDivider(index: number): boolean {
    if (index === 0) {
      this.uiService.previousMessage = this.currentMessage
      return true;

    } else {
      const currentDate = this.getFormattedDate(this.currentMessage.timeStamp);
      const previousDate = this.getFormattedDate(this.uiService.previousMessage.timeStamp);
      this.uiService.previousMessage = this.currentMessage;
      return currentDate !== previousDate;
    }
  }

  /**
   * Umschalten des Emoji-Pickers.
   */
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
   * Überprüft, ob eine Reaktion im Singular oder Plural angezeigt werden soll.
   * 
   * @param {Reaction} reaction - Die Reaktion, die überprüft wird.
   * @returns {string} - Der korrekte Text für Singular oder Plural.
   */
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

  /**
   * Verarbeitet die Auswahl eines Emojis.
   * 
   * @param {any} event - Das Ereignis, das das ausgewählte Emoji enthält.
   */
  manageEmoji(event: any) {
    const emoji = event.emoji;
    this.reactService.updateMessageWithReaction(emoji, this.currentMessage)
  }

  /**
   * Entfernt ein Emoji aus der aktuellen Nachricht.
   */
  manageDeleteEmoji() {
    this.reactService.deleteEmoji(this.currentMessage)
  }

  /**
   * Aktiviert den Bearbeitungsmodus für eine Nachricht.
   */
  async showEditArea() {
    this.editMode = true;
    this.editText = this.currentMessage.text;
    //this.editTextArea.nativeElement.focus();
  }

  /**
   * Bricht den Bearbeitungsmodus ab.
   */
  cancelEditArea() {
    this.editText = '';
    this.editMode = false;
  }

  /**
   * Speichert die bearbeitete Nachricht, wenn das Formular gültig ist.
   * 
   * @param {NgForm} ngForm - Das Formular, das die bearbeitete Nachricht enthält.
   */
  async onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      await this.saveEditMessage();
      this.editText = '';
      this.editMode = false;
    }
  }

  /**
   * Speichert die bearbeitete Nachricht in Firestore.
   */
  async saveEditMessage() {
    const msgId = this.currentMessage.msgId;
    this.currentMessage.text = this.editText;
    const ref = await this.reactService.searchMsgById(msgId);
    if (!ref) {
      return;
    }

    const convData = await this.reactService.getDataFromRef(ref);
    if (convData) {
      const message = this.reactService.findMessageData(convData, msgId);
      message.text = this.editText;
      const messages = convData['messages'];
      const dataRef = this.reactService.getDocRef(ref)
      this.reactService.updateMessageInFirestore(dataRef, messages)
    }
  }

  /**
   * Schaltet die Sichtbarkeit des Bearbeiten-Popups für Nachrichten um.
   */
  toggleEditPopup() {
    this.showEditPopup = !this.showEditPopup;
  }

  /**
 * Behandelt Klicks außerhalb bestimmter Elemente im Dokument.
 * 
 * @param {Event} event - Das Klick-Ereignis, das irgendwo im Dokument ausgelöst wurde.
 * 
 */
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (this.emojiPicker && !this.emojiPicker.nativeElement.contains(event.target)) {
      this.showEmojiPicker = false;
    }
    if (this.editPopup) {
      this.showEditPopup = false;
    }
  }
}