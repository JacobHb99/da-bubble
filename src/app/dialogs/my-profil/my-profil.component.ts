import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-my-profil',
  standalone: true,
  imports: [ MatDialogModule],
  templateUrl: './my-profil.component.html',
  styleUrl: './my-profil.component.scss'
})
export class MyProfilComponent {
  authService = inject(AuthService);
}
