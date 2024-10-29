import { Component,inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  authService = inject(AuthService);
  user:any;
  
  constructor( ) {
     
  }
   
}
