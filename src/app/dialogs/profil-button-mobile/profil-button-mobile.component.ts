import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

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


    constructor(private authService: AuthService) {

    }

  openLink(event: MouseEvent, status?: 'profil' | 'logout'): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();

    if (status == 'logout') {
      this.authService.signOut();
    }

    if (status == 'profil') {
      this.openEditProfilDialog();
    }
  }

  openEditProfilDialog() {
    const dialogRef = this.dialog.open(EditProfileComponent);
  }
}
