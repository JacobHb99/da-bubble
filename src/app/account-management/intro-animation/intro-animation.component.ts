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
  containerVisible = true;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      this.containerVisible = false;
      this.authService.showAnimation = false;
    }, 4500);
  }
}
