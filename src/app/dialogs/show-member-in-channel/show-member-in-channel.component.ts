import { Component } from '@angular/core';
import { SingleMemberComponent } from "./single-member/single-member.component";

@Component({
  selector: 'app-show-member-in-channel',
  standalone: true,
  imports: [SingleMemberComponent],
  templateUrl: './show-member-in-channel.component.html',
  styleUrl: './show-member-in-channel.component.scss'
})
export class ShowMemberInChannelComponent {

}
