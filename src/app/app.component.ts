import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelChatComponent } from "./main/channel-chat/channel-chat.component";
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './main/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChannelChatComponent, HeaderComponent, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble';
}
