import { Component, inject } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    HeaderSignComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authService = inject(AuthService)
  router = inject(Router)
  regFormData = {
    email: '',
    username: '',
    password: ''
  }



  onSubmit(): void {
    this.authService.saveRegistrationData(this.regFormData.email, this.regFormData.username, this.regFormData.password);
    this.router.navigate(['/avatar']);
  }
}
