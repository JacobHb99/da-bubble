import { Component } from '@angular/core';
import { HeaderSignComponent } from '../../header-sign/header-sign.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    HeaderSignComponent,
    RouterLink
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
