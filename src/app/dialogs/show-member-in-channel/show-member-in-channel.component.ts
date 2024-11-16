import { Component } from '@angular/core';
import { SingleMemberComponent } from "./single-member/single-member.component";
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-show-member-in-channel',
  standalone: true,
  imports: [SingleMemberComponent,MatDialogModule],
  templateUrl: './show-member-in-channel.component.html',
  styleUrl: './show-member-in-channel.component.scss'
})
export class ShowMemberInChannelComponent {

}
