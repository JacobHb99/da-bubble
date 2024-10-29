import { Component } from '@angular/core';
import { SingleMessageComponent } from './single-message/single-message.component';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [SingleMessageComponent],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.scss'
})
export class MessageThreadComponent {

}
