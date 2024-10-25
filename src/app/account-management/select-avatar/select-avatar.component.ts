import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [
    HeaderSignComponent,
    RouterLink
  ],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentData = this.authService.currentRegData;
  avatarIcons: string[] = [
    "/img/avatars/avatar_big_0.png",
    "/img/avatars/avatar_big_1.png",
    "/img/avatars/avatar_big_2.png",
    "/img/avatars/avatar_big_3.png",
    "/img/avatars/avatar_big_4.png",
    "/img/avatars/avatar_big_5.png",
  ];
  chosenAvatar!: string;
  registrationFailed: boolean = false;
  errorMassage: String = '';

  constructor() {}


  setAvatar(avatar: string) {
    if(avatar !== this.chosenAvatar) {
      this.chosenAvatar = avatar;
    } else{
      this.chosenAvatar = "/img/avatars/avatar_default.png";
    }
  }


  submitRegistration(): void {
    this.authService.register(this.currentData.email, this.currentData.username, this.currentData.password, this.chosenAvatar)
    .subscribe({
      next: () => {

        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 1000);
      },

      error: (err) => {
        console.log(err.code);
        
        if (err.code === 'auth/email-already-in-use') {
          this.registrationFailed = true;
          this.errorMassage = 'Email existiert bereits!';
        } else {
          this.registrationFailed = true;
          this.errorMassage = 'Irgendetwas ist schief gelaufen!';
        }
      }
    })
  }


}
