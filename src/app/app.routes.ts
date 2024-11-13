import { Routes } from '@angular/router';
import { LoginComponent } from './account-management/login/login.component';
import { RegisterComponent } from './account-management/register/register.component';
import { SelectAvatarComponent } from './account-management/select-avatar/select-avatar.component';
import { ChannelChatComponent } from './main/channel-chat/channel-chat.component';
import { MainComponent } from './main/main.component';
import { ResetPasswordComponent } from './account-management/reset-password/reset-password.component';
import { NewPasswordComponent } from './account-management/new-password/new-password.component';
import { ImprintComponent } from './account-management/policy/imprint/imprint.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'avatar', component: SelectAvatarComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'new-password', component: NewPasswordComponent },
    { path: 'main', component:  MainComponent},
    { path: 'imprint', component:  ImprintComponent},


];
