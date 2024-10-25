import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelChatComponent } from "./main/channel-chat/channel-chat.component";
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChannelChatComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble';
}
