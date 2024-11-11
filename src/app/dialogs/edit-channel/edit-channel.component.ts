import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent implements OnInit {
  channel: Channel | undefined;
  isHoveredClose = false;


  constructor(public dialogRef: MatDialogRef<EditChannelComponent>, public dialog: MatDialog, public channelService: ChannelService, private firebaseService: FirebaseService, public authService: AuthService){}

  ngOnInit(): void {
    // Abonnieren des Observables, um aktuelle Kanal-Daten zu erhalten
    this.channelService.currentChannel$.subscribe((channel: Channel) => {
      this.channel = channel;  // Hier werden die Daten gesetzt
      console.log(this.channel);  // Zum Debuggen
    });
  }
  
   closeEditChannel(): void {
    this.dialogRef.close()
   }
  }
