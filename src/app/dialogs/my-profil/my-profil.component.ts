import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-my-profil',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    MatTooltip
    ],
  templateUrl: './my-profil.component.html',
  styleUrl: './my-profil.component.scss'
})
export class MyProfilComponent {
  authService = inject(AuthService);
    readonly dialog = inject(MatDialog);


  openEditProfileDialog(){
    const dialogRef = this.dialog.open(EditProfileComponent, {
    });
  }
  
}
