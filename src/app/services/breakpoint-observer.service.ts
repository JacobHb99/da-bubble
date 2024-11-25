import { DestroyRef, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Directive, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class BreakpointObserverService {

  private screenSizeSubject = new BehaviorSubject<'XSmall' | 'Small' | 'Medium' | 'Large'>('Large');
  screenSize$ = this.screenSizeSubject.asObservable();
  isXSmallOrSmall: boolean = false;


  constructor(private breakpointObserver: BreakpointObserver) {
    this.initBreakpointObserver();
  }

  private initBreakpointObserver() {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.screenSizeSubject.next('XSmall');
          this.isXSmallOrSmall = true;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.screenSizeSubject.next('Small');
          this.isXSmallOrSmall = true;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.screenSizeSubject.next('Medium');
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.screenSizeSubject.next('Large');
        }
      });
  }

  /**
   * Getter for current screen size as a string ('XSmall', 'Small', 'Medium', 'Large').
   * @returns 'XSmall' | 'Small' | 'Medium' | 'Large'
   */
  getCurrentScreenSize(): 'XSmall' | 'Small' | 'Medium' | 'Large' {
    return this.screenSizeSubject.getValue();
  }



  }
