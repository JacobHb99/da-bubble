import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userSource = new BehaviorSubject<any>(null);
  selectedUser = this.userSource.asObservable();

  setUser(user: any) {
    this.userSource.next(user);
  }
}



