import { Component } from '@angular/core';
import { SingleMessageComponent } from './single-message/single-message.component';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { FirebaseService } from '../../../services/firebase.service';
import { UserDataService } from '../../../services/user.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [SingleMessageComponent, SideNavComponent],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.scss'
})
export class MessageThreadComponent {
  user: any;

  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });
  }
}
