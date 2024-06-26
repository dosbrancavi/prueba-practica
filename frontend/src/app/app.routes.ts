import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { canActivateAuthnGuard } from './auth/guards/auth.guard';
import { publicGuard } from './auth/guards/public.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent, canActivate: [publicGuard]},
    {path: 'register', component:RegisterComponent, canActivate: [publicGuard]},
    {path: 'tasks', component: TasksComponent, canActivate: [canActivateAuthnGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [canActivateAuthnGuard]}
];
