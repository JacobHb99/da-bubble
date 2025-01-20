import { Directive, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
    //console.log('Element:', this.elementRef.nativeElement);
  }
}

// export class AutofocusDirective implements OnChanges {
//   @Input() placeholder!: string; // Beobachte den Placeholder

//   constructor(private elementRef: ElementRef) { }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['placeholder']) {
//       this.focusElement();
//     }
//   }

//   private focusElement() {
//     const element = this.elementRef.nativeElement as HTMLTextAreaElement;
//     if (!element.value) {
//       setTimeout(() => element.focus(), 0);
//     }
//   }
  
// }

