import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  constructor( public dialogRef: MatDialogRef<ProfilComponent>,  @Inject(MAT_DIALOG_DATA) public data:any){
    
  }
  
 
  

}
