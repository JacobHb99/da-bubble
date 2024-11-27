import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SingleMessageComponent } from './single-message/single-message.component';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { UserDataService } from '../../../services/user.service';
import { InterfaceService } from '../../../services/interface.service';
import { FirebaseService } from '../../../services/firebase.service';
import { BreakpointObserverService } from '../../../services/breakpoint-observer.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [SingleMessageComponent, SideNavComponent, CommonModule],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.scss'
})
export class MessageThreadComponent {
  user: any;
  uiService = inject(InterfaceService);
  fiBaService = inject(FirebaseService);

  constructor(
    private userDataService: UserDataService,
    public breakpointObserver: BreakpointObserverService,
  ) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });
  }


  ngOnInit() {
    this.uiService.scrollTrigger$.subscribe((elementId: string) => {
      setTimeout(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.warn("Element not found:", elementId);
        }
      }, 0); // Timeout, um sicherzustellen, dass das DOM gerendert ist
    });
  }
}
