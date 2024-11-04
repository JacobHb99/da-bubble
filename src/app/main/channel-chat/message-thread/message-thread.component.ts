import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SingleMessageComponent } from './single-message/single-message.component';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { UserDataService } from '../../../services/user.service';
import { InterfaceService } from '../../../services/interface.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [SingleMessageComponent, SideNavComponent, CommonModule],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.scss'
})
export class MessageThreadComponent {
  user: any;
  uiService = inject(InterfaceService);
  threadIsEmpty = true;

  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });


  }
}
