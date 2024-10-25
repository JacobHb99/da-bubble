import { Routes } from '@angular/router';
import { LoginComponent } from './account-management/login/login.component';
import { RegisterComponent } from './account-management/register/register.component';
import { SelectAvatarComponent } from './account-management/select-avatar/select-avatar.component';
import { ChannelChatComponent } from './main/channel-chat/channel-chat.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'avatar', component: SelectAvatarComponent },
    { path: 'landing', component:  ChannelChatComponent},

];
