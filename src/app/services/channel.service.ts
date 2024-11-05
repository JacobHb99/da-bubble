import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private channelNameSource = new BehaviorSubject<string>('');
  currentChannelName = this.channelNameSource.asObservable();
 

  updateChannelName(name: string) {
    this.channelNameSource.next(name);
  }

  
}
