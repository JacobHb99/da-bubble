import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    HeaderSignComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  emailForm = new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]);


  onSubmit() {
    if(this.emailForm.value) {
      let email: string = this.emailForm.value;
      this.authService.sendPasswordReset(email);
    } else {
      alert('ERROR')
    }
  }
}
