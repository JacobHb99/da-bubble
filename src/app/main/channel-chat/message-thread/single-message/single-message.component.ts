import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../services/user.service';
import { InterfaceService } from '../../../../services/interface.service';
import { Message} from '../../../../models/message.model';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  uiService = inject(InterfaceService);
  fiBaService = inject(FirebaseService);

  messageIsMine: boolean = true;
  showReactionPopups: boolean = false;
  user: any;
  currentDate: string;
  currentMessage: Message = new Message();



  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });

    this.currentDate = this.fiBaService.getCurrentDate();
  }

  onMouseOver() {
    this.showReactionPopups= true;
  }

  onMouseLeave() {
    this.showReactionPopups = false;
  }

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

}
