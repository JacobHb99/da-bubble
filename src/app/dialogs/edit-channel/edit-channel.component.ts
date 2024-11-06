import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  isHoveredClose = false;

  constructor(public dialogRef: MatDialogRef<EditChannelComponent>, public dialog: MatDialog){}
  


   closeEditChannel(): void {
    this.dialogRef.close()

   }
  }
