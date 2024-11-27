import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { User } from '../../models/user.model';
import { UserDataService } from '../../services/user.service';
import { InterfaceService } from '../../services/interface.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../../dialogs/add-channel/add-channel.component';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { ConversationService } from '../../services/conversation.service';
import { user } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserverService } from '../../services/breakpoint-observer.service';
import { SearchbarService } from '../../services/searchbar.service';
import { Channel } from '../../models/channel.model';
import { Conversation } from '../../models/conversation.model';
import { Message } from '../../models/message.model';



@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  channelNameArray: string[] = [];
  showFiller = false;
  menuVisible = false;
  isHoveredEdit = false;
  isHoveredAdd = false;
  isHoveredMenu = false;
  isHoveredUser = false;
  isHoveredChannel = false;
  hideUser = false;
  hideChannel = false;
  isOnline = false;
  channelName = "";
  currentUser?: User;
  arrowImg: string = 'icons/arrow_drop_down.png'
  workspaceImg: string = 'icons/workspaces.png'
  tagImg: string = "/icons/tag.png"
  addImg: string = "/icons/add_circle.png"
  accountImg: string = "/icons/account_circle.png"
  menuImg: string = "/icons/Hide-navigation.png"
  uiService = inject(InterfaceService);
  conService = inject(ConversationService);
  channelService = inject(ChannelService)
  channels: any[] = []

  constructor(
    public firebaseService: FirebaseService,
    public userDataService: UserDataService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserverService,
    public searchbarService: SearchbarService
  ) { }


  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.uiService.toggleSidenav();
    console.log(this.uiService.showSidenav);
  }

  openNewMessage() {
    this.uiService.changeContent('newMessage');
    this.toggleMenu();
  }

  changeImg() {
    this.arrowImg = 'icons/arrow_drop_down-blue.png';
    this.workspaceImg = 'icons/workspaces-blue.png';

  }
  resetImg() {
    this.arrowImg = 'icons/arrow_drop_down.png';
    this.workspaceImg = 'icons/workspaces.png';
  }


  changeImgChannel() {
    this.addImg = "icons/add_circle-blue.png";

  }
  resetImgChannel() {
    this.addImg = "icons/add_circle.png";
  }

  changeImgMessage() {
    this.arrowImg = 'icons/arrow_drop_down-blue.png';
    this.accountImg = "/icons/account_circle-blue.png";

  }
  resetImgMessage() {
    this.arrowImg = 'icons/arrow_drop_down.png';
    this.accountImg = "/icons/account_circle.png";
  }

  changeImgMenu() {
    this.menuImg = "icons/hide-navigation-blue.png";
  }
  resetImgMenu() {
    this.menuImg = "icons/Hide-navigation.png";

  }

  toggleUser() {
    this.hideUser = !this.hideUser;
  }

  toggleChannel() {
    this.hideChannel = !this.hideChannel;
  }

  startConversation(obj: User) {
    console.log('openMSG');

    this.conService.startConversation(obj);

    if (this.breakpointObserver.isXSmallOrSmall) {
      this.toggleMenu();
    }
  }

  openChannel(obj: any) {
    console.log('openchannel');

    this.channelService.showChannelChat(obj)
    if (this.breakpointObserver.isXSmallOrSmall) {
      this.toggleMenu();
    }
  }


  // showUserChat(user: any) {
  //   this.userDataService.setUser(user);
  //   this.uiService.changeContent('directMessage');
  // }

  openDialogChannel(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '100%', 
      maxWidth: '873px', 
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  openSearchMsg(conversation: Conversation, msg: Message) {
    let currentUid = this.userDataService.currentUserSig()?.uid as string;
    let foundId: string | null = null;
    let foundUser: User;

    foundUser = this.searchforId(conversation, currentUid, foundId);

    if (foundUser) {
      this.startConversation(foundUser)
      // Sende die ID des Ziels an den Service
      const targetMessageId = `${msg.msgId}`; // Beispiel-ID
      this.uiService.triggerScrollTo(targetMessageId);
    } else {
      console.error("No matching user found in allUsers.");
    }
  }

  searchforId(conversation: Conversation, currentUid: string, foundId: string | null) {
    conversation.user.forEach(uid => {
      if (uid !== currentUid) {
        foundId = uid;
      }
    });
    return this.firebaseService.allUsers.find(user => user.uid === foundId) as User;
  }
}
