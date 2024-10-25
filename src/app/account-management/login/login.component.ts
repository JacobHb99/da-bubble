import { Component } from '@angular/core';
import { HeaderSignComponent } from '../header-sign/header-sign.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderSignComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  // myFunction() {
  //   var x = document.getElementById("myInput");
  //   if (x.type === "password") {
  //     x.type = "text";
  //   } else {
  //     x.type = "password";
  //   }
  // }
}
