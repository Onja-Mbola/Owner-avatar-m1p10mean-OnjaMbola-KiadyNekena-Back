import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { NoAuthGuard } from 'src/app/noauth.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent , canActivate: [NoAuthGuard]},
    { path: 'register',       component: RegisterComponent }
];
