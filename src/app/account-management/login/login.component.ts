import { Component, inject, OnInit } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { IntroAnimationComponent } from '../intro-animation/intro-animation.component';
import { CommonModule } from '@angular/common';
import { ImpressComponent } from '../impress/impress.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderSignComponent,
    ImpressComponent,
    FormsModule,
    IntroAnimationComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent implements OnInit {
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


  ngOnInit() {
    console.log(this.authService.currentUserSig());
    
    if(this.authService.currentUserSig()) {
      this.router.navigate(['/main']);
  }
}


  // guestLogin() {
  //   this.authService.signInAnonymously();
  // }


  login(): void {
    let user = this.userForm.getRawValue()
    this.loginFailed = false;
    this.authService.login(user.email, user.password)
    .subscribe({
      next: () => {

        // setTimeout(() => {
        //   this.router.navigateByUrl('/');
        // }, 1000);
      },

      error: (err) => {
        console.log(err.code);  
        if (err.code === "auth/invalid-credential") {
          this.loginFailed = true;
          this.errorMessage = 'Diese Anmeldedaten sind ungültig!';
          console.log('loginFailed', this.loginFailed);
          console.log('MESSAGE', this.errorMessage);
        } else {
          this.loginFailed = true;
          this.errorMessage = 'Irgendetwas ist schief gelaufen!';
          console.log('loginFailed', this.loginFailed);
          console.log('MESSAGE', this.errorMessage);
        }
        this.userForm.reset();
      }
    })
      // .pipe(
      //   catchError((error) => {
      //     this.loginFailed = true;
      //     console.log('loginFailed', this.loginFailed);
          
      //     return of(null);  
      //   })
      // )
      // .subscribe(() => {
      // })
  }


  async guestLogin() {
    try {
      await this.authService.guestLogin();
      this.router.navigate(['/main']);
    } catch (error) {
      this.loginFailed = true;
    }
  }
}
