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
import { Thread } from '../../models/thread.model';



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
    if (this.uiService.showThread && this.breakpointObserver.isMedium) {
      this.uiService.closeThread()
      if (!this.uiService.showSidenav()) {
        this.uiService.toggleSidenav();
      }
    }else{
      this.menuVisible = !this.menuVisible;
      this.uiService.toggleSidenav();
      console.log(this.uiService.showSidenav);
    }

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

  startConversation(obj: User, msg?: Message) {
    console.log('openMSG');

    this.conService.startConversation(obj);

    if (this.breakpointObserver.isXSmallOrSmall) {
      this.toggleMenu();
    }
    if (msg) {
      this.scrollInChat(msg);
    }else{
      this.scrollToLastMessage(obj);
    }
  }

  openChannel(obj: any, msg?: Message) {
    console.log('openchannel');

    this.channelService.showChannelChat(obj)
    if (this.breakpointObserver.isXSmallOrSmall) {
      this.toggleMenu();
    }
    if (msg) {
      this.scrollInChat(msg);
    }else{
      this.scrollToLastMessage(obj);
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


  openSearchMsg(conversation: Conversation | Channel, msg: Message, chaId?: string) {
    let currentUid = this.userDataService.currentUserSig()?.uid as string;
    let foundId: string | null = null;
    let foundUser!: User | Channel | undefined;

    if ('conId' in conversation) {
      foundUser = this.searchforUserId(conversation, currentUid, foundId);
    }

    if (foundUser) {
      if ('uid' in foundUser) {
        this.startConversation(foundUser)
      }
      this.scrollInChat(msg);
    } else {
      this.openChannel(conversation, msg);
    }
  }

  openThreadMsg(data: Thread, msg: Message) {
    this.uiService.currentThread = data;
    console.log(this.uiService.currentThread);

    if (data.type == 'channel') {
      this.openChannelThread(data, msg);
    } else {
      this.openConvThread(data, msg)
    }

    this.scrollInChat(msg);
  }

  scrollToLastMessage(obj: User | Channel) {
    let conv: Channel | Conversation;
    let lastMsg: Message | undefined;
    if ('uid' in obj) {
      conv = this.conService.getCurrentConversation(obj)
      let messages = conv.messages
      lastMsg = messages[messages.length - 1]
    }

    if ('chaId' in obj) {
      conv = obj;
      let messages = conv.messages
      lastMsg = messages[messages.length - 1]
    }
    if (lastMsg) {
      this.scrollInChat(lastMsg);
    }
  }

  scrollInParentChat(msg: Message) {
    // Sende die ID des Ziels an den Service
    const targetParentId = `${msg.parent?.msgId}`;
    this.uiService.triggerScrollTo(targetParentId);
  }

  scrollInChat(msg: Message) {
    // Sende die ID des Ziels an den Service
    const targetMessageId = `${msg.msgId}`;
    this.uiService.triggerScrollTo(targetMessageId);
  }

  openChannelThread(data: Thread, msg: Message) {
    let channel = this.findChannel(data)
    this.openChannel(channel, msg)
      this.uiService.openThread();
      if(msg.parent) {
        this.uiService.setMsg(msg.parent);
      }
  }

  openConvThread(data: Thread, msg: Message) {
    let currentUid = this.userDataService.currentUserSig()?.uid as string;
    let foundId: string | null = null;
    let conv = this.findConversation(data);
    let user = this.searchforUserId(conv, currentUid, foundId)
    if (user) {
      if ('uid' in user) {
        this.startConversation(user);
        this.uiService.openThread();
        if(msg.parent) {
          this.uiService.setMsg(msg.parent);
        }
      }
    }
  }

  findChannel(thread: Thread) {
    return this.firebaseService.allChannels.find(channel => channel.chaId === thread.convId) as Channel;
  }

  findConversation(thread: Thread) {
    return this.firebaseService.allConversations.find(conv => conv.conId === thread.convId) as Conversation;
  }

  searchforUserId(conversation: Conversation | Channel, currentUid: string, foundId: string | null) {
    if (conversation) {
      if ('user' in conversation) {
        conversation.user.forEach(uid => {
          if (uid !== currentUid) {
            foundId = uid;
          }
        });
        return this.firebaseService.allUsers.find(user => user.uid === foundId) as User;
      } else {
        let currentChannel = this.channelService.currentChannelSubject.value

        return this.firebaseService.allChannels.find(channel => channel.chaId === foundId) as Channel;
      }
    }
    return;
  }
}
