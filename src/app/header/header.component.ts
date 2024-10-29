
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ProfilLogoutButtonsComponent } from '../dialogs/profil-logout-buttons/profil-logout-buttons.component';
import { MyProfilComponent } from '../dialogs/my-profil/my-profil.component';
import { EditProfileComponent } from '../dialogs/edit-profile/edit-profile.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatIconModule, MatFormFieldModule, FormsModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
   

  openDialog() {
    const dialogRef = this.dialog.open(ProfilLogoutButtonsComponent,{
      width: '70px',
      position: { top: '136px', right: '0' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result=='profil') {
        this.openOwnProfilDialog();
      }else if (result=='logout'){
         this.authService.signOut();
      }
    });
  }

  openOwnProfilDialog(){
    const dialogRef = this.dialog.open(MyProfilComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result=='edit') {
        this.openEditProfilDialog();
      }
    });
  }

  openEditProfilDialog(){
    const dialogRef = this.dialog.open(EditProfileComponent);
  }
  

}
