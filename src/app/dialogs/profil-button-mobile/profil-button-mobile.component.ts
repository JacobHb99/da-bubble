import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MyProfilComponent } from '../my-profil/my-profil.component';
import { UserDataService } from '../../services/user.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-profil-button-mobile',
  standalone: true,
  imports: [],
  templateUrl: './profil-button-mobile.component.html',
  styleUrl: './profil-button-mobile.component.scss'
})
export class ProfilButtonMobileComponent {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<ProfilButtonMobileComponent>>(MatBottomSheetRef);
    readonly dialog = inject(MatDialog);


    constructor(private authService: AuthService, public firebaseService: FirebaseService) {

    }

    async openLink(event: MouseEvent, status?: 'profil' | 'logout'): Promise<void> {
      this._bottomSheetRef.dismiss();
      event.preventDefault();
    
      if (status === 'logout') {
        const currentUser = this.authService.currentCredentials;
        console.log(currentUser);
    
        // Logge den Benutzer aus.
        await this.authService.signOut();
      }
    
      if (status === 'profil') {
        this.openEditProfilDialog();
      }
    }

  openEditProfilDialog() {
    const dialogRef = this.dialog.open(MyProfilComponent, {
      width: '100%',
      maxWidth: '873px',
    });
  }
}
