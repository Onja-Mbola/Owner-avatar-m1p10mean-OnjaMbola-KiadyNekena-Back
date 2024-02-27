import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { NoAuthGuard } from 'src/app/noauth.guard';
import { LoginAdminComponent } from 'src/app/pages/login-admin/login-admin.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent , canActivate: [NoAuthGuard]},
    { path: 'login-admin',          component: LoginAdminComponent , canActivate: [NoAuthGuard]},
    { path: 'register',       component: RegisterComponent }
];
