import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderSignComponent,
    FormsModule,
    ReactiveFormsModule
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
        if (!this.loginFailed) {
          this.router.navigate(['/landing']);
        }
      });
  }
}
