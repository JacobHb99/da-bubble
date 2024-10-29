import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';



@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
showFiller = false;
menuVisible = false;
isHoveredEdit = false;
isHoveredAdd = false;
arrowImg: string = 'icons/arrow_drop_down.png'
workspaceImg: string = 'icons/workspaces.png'
tagImg: string = "/icons/tag.png"
addImg: string = "/icons/add_circle.png"
accountImg: string = "/icons/account_circle.png"
menuImg: string = "/icons/Hide-navigation.png"
constructor(public firebaseService: FirebaseService){}


toggleMenu() {
  this.menuVisible = !this.menuVisible
}

changeImg() {
  this.arrowImg = 'icons/arrow_drop_down-blue.png'
  this.workspaceImg = 'icons/workspaces-blue.png'
  
}
resetImg() {
  this.arrowImg = 'icons/arrow_drop_down.png'
  this.workspaceImg = 'icons/workspaces.png'
}

changeImgDev() {
  this.tagImg = 'icons/tag-blue.png'
  
}
resetImgDev() {
  this.tagImg = 'icons/tag.png'
}

changeImgChannel() {
  this.addImg= "icons/add_circle-blue.png"
  
}
resetImgChannel() {
  this.addImg = "icons/add_circle.png"
}

changeImgMessage() {
  this.arrowImg= 'icons/arrow_drop_down-blue.png'
  this.accountImg = "/icons/account_circle-blue.png"
  
}
resetImgMessage() {
   this.arrowImg= 'icons/arrow_drop_down.png'
   this.accountImg = "/icons/account_circle.png"
}

changeImgMenu() {
 this.menuImg = "icons/hide-navigation-blue.png"
}
resetImgMenu() {
   this.menuImg = "icons/Hide-navigation.png"
  
}
}
