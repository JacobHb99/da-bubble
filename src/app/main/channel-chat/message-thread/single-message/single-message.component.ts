import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../services/user.service';
import { InterfaceService } from '../../../../services/interface.service';
import { Message} from '../../../../models/message.model';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {
  uiService = inject(InterfaceService);

  messageIsMine: boolean = true;
  showReactionPopups: boolean = false;
  user: any;
  currentDate: string;

  currentMessage: Message = new Message();



  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });

    this.currentDate = this.getCurrentDate();
  }

  getCurrentDate() {
    const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
      "August", "September", "Oktober", "November", "Dezember"];

    const today = new Date();
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const monthName = months[today.getMonth()];
    return `${dayName}, ${day}. ${monthName}`;
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
