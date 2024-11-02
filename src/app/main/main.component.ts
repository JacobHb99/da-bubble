import { Component, inject } from '@angular/core';
import { ChannelChatComponent } from './channel-chat/channel-chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThreadComponent } from './thread/thread.component';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../services/firebase.service';
import { AddPeopleComponent } from '../dialogs/add-people/add-people.component';
import { CommonModule } from '@angular/common';
import { InterfaceService } from '../services/interface.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent,ChannelChatComponent, SideNavComponent, ThreadComponent, AddPeopleComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  fireService = inject(FirebaseService);
  uiService = inject(InterfaceService);

  ngOnInit() {
    this.fireService.getAllUsers();
  }
}
