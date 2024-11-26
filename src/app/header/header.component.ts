
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
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


  constructor(public searchbarService: SearchbarService, public conService: ConversationService, public channelService: ChannelService, public breakpointObserver: BreakpointObserverService) {
    setTimeout(() => {
      this.searchbarService.combineArraysWithTypes();
    }, 3000);
    
  }
   

  openDialog() {
    const rightPosition = window.innerWidth>1920 ? (window.innerWidth - 1920) /2 : 0;
    let topPosition;
    if (this.breakpointObserver.isXSmallOrSmall) {
      topPosition = '85px';
    } else {
      topPosition = '110px';
    }
    const dialogRef = this.dialog.open(ProfilLogoutButtonsComponent,{
      width: '70px',
      position: { top: topPosition, right: `${rightPosition}px` },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result=='profil') {
        this.openOwnProfilDialog();
      }else if (result=='logout'){
         this.authService.signOut();
      }
    });
  }
 
  openOwnProfilDialog(){
    const rightPosition = window.innerWidth>1920 ? (window.innerWidth - 1920) /2 : 0;
    const dialogRef = this.dialog.open(MyProfilComponent,{
      position: { top: '110px', right: `${rightPosition}px` },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result=='edit') {
        this.openEditProfilDialog();
      }
    });
  }

  openEditProfilDialog(){
    const dialogRef = this.dialog.open(EditProfileComponent);
  }
  

}
