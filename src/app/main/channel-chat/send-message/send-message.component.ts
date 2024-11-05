import { Component,Input } from '@angular/core';
import { Message} from '../../../models/message.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent {
  @Input() placeholder: string = '';



  // sendMessage(): Message {
  //   return new Message({
  //    // timeStamp: ,
  //     //sender: ,
  //     text: text,
  //     //thread: new Thread,
  //     //reactions: []
  //   });
  // }
}
