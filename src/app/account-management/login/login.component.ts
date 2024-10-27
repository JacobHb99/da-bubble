import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { IntroAnimationComponent } from '../intro-animation/intro-animation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderSignComponent,
    FormsModule,
    IntroAnimationComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {
  authService = inject(AuthService);
  fireService = inject(FirebaseService);
  router = inject(Router);
  fb = inject(NonNullableFormBuilder)
  errorMessage: string | null = null;
  loginFailed: boolean = false;

  userForm = this.fb.group({
    email: this.fb.control('', {validators: [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]}),
    password: this.fb.control('', {validators: [Validators.required, Validators.minLength(6)]})
  });


  constructor() {
    this.authService.errorMessage = '';
  }


  login(): void {
    let user = this.userForm.getRawValue()
    this.loginFailed = false;
    this.authService.login(user.email, user.password)
      .pipe(
        catchError((error) => {
          this.loginFailed = true;
          return of(null);  
        })
      )
      .subscribe(() => {
      })
  }
}
