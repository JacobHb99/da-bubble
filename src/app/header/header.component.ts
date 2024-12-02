
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProfilLogoutButtonsComponent } from '../dialogs/profil-logout-buttons/profil-logout-buttons.component';
import { MyProfilComponent } from '../dialogs/my-profil/my-profil.component';
import { EditProfileComponent } from '../dialogs/edit-profile/edit-profile.component';
import { SearchbarService } from '../services/searchbar.service';
import { timeout } from 'rxjs';
import { ConversationService } from '../services/conversation.service';
import { ChannelService } from '../services/channel.service';
import { BreakpointObserverService } from '../services/breakpoint-observer.service';
import { SideNavComponent } from '../main/side-nav/side-nav.component';
import { InterfaceService } from '../services/interface.service';
import { Conversation } from '../models/conversation.model';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { Thread } from '../models/thread.model';
import { Channel } from '../models/channel.model';
import { ProfilButtonMobileComponent } from '../dialogs/profil-button-mobile/profil-button-mobile.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatIconModule, MatFormFieldModule, FormsModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  isHoveredEdit = false;
  uiService = inject(InterfaceService)
  private _bottomSheet = inject(MatBottomSheet);


  constructor(
    public searchbarService: SearchbarService,
    public conService: ConversationService,
    public channelService: ChannelService,
    public breakpointObserver: BreakpointObserverService,
    private firebaseService: FirebaseService
  ) {
    setTimeout(() => {
      this.searchbarService.combineArraysWithTypes();
    }, 3000);

  }


  openDialog() {
    const rightPosition = window.innerWidth > 1920 ? (window.innerWidth - 1920) / 2 : 0;
    let topPosition;
    let dialogRef: MatDialogRef<ProfilLogoutButtonsComponent, any>
    if (this.breakpointObserver.isXSmallOrSmall) {
      this.openBottomSheet();
    } else {
      topPosition = '110px';
      dialogRef = this.dialog.open(ProfilLogoutButtonsComponent, {
        width: '70px',
        position: { top: topPosition, right: `${rightPosition}px` },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'profil') {
          this.openOwnProfilDialog();
        } else if (result == 'logout') {
          this.authService.signOut();
        }
      });
    }
  }


  openBottomSheet(): void {
    this._bottomSheet.open(ProfilButtonMobileComponent);
  }

  openOwnProfilDialog() {
    const rightPosition = window.innerWidth > 1920 ? (window.innerWidth - 1920) / 2 : 0;
    const dialogRef = this.dialog.open(MyProfilComponent, {
      position: { top: '110px', right: `${rightPosition}px` },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'edit') {
        this.openEditProfilDialog();
      }
    });
  }

  openEditProfilDialog() {
    const dialogRef = this.dialog.open(EditProfileComponent);
  }

  openSearchMsg(conversation: Conversation | Channel, msg: Message, chaId?: string) {
    let currentUid = this.authService.currentUserSig()?.uid as string;
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
      this.openChannel(conversation);
      this.scrollInChat(msg);
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

    this.scrollInParentChat(msg);
    this.scrollInChat(msg);

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
    this.openChannel(channel)
    this.uiService.openThread();
    if (msg.parent) {
      this.uiService.setMsg(msg.parent);
    }
  }

  openConvThread(data: Thread, msg: Message) {
    let currentUid = this.authService.currentUserSig()?.uid as string;
    let foundId: string | null = null;
    let conv = this.findConversation(data);
    let user = this.searchforUserId(conv, currentUid, foundId)
    if (user) {
      if ('uid' in user) {
        this.startConversation(user);
        this.uiService.openThread();
        if (msg.parent) {
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

  startConversation(obj: User) {
    console.log('openMSG');
    this.conService.startConversation(obj);
  }

  openChannel(obj: any) {
    console.log('openchannel');
    this.channelService.showChannelChat(obj)
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
