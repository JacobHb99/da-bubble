
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';
=======
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
>>>>>>> 99e039d64768339d96d5f6bb34cb97fd62edc1db


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatIconModule, MatFormFieldModule, FormsModule, ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
<<<<<<< HEAD
authService = inject(AuthService)
=======
  authService = inject(AuthService);
>>>>>>> 99e039d64768339d96d5f6bb34cb97fd62edc1db
}
