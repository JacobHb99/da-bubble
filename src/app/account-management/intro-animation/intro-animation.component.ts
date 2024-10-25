import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
// import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-intro-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-animation.component.html',
  styleUrl: './intro-animation.component.scss'
})
export class IntroAnimationComponent implements OnInit{
  containerVisible: boolean | undefined | null;


  constructor(public authService: AuthService) {
    console.log(this.containerVisible);
  }

  ngOnInit() {
    if (this.containerVisible === undefined) {
      this.containerVisible = true;
      this.authService.showAnimation = true;
    }else {
      this.containerVisible = false;
      this.authService.showAnimation = false;
    }
    setTimeout(() => {
      this.containerVisible = false;
      this.authService.showAnimation = false;
    }, 3500);
  }
}
