import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { ToastsContainer } from './toast/toasts.container.component';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './noauth.guard';
import { UserService } from './services/user.service';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { ServicesListComponent } from './pages/admin-services/services-list/services-list.component';
import { ServicesCreateComponent } from './pages/admin-services/services-create/services-create.component';
import { ServicesEditComponent } from './pages/admin-services/services-edit/services-edit.component';
import { CommonModule } from '@angular/common';
import { LoginAdminComponent } from './pages/login-admin/login-admin.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastsContainer,
    CommonModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    LoginComponent,
    LoginAdminComponent,
    DashboardAdminComponent,
    ServicesListComponent,
    ServicesCreateComponent,
    ServicesEditComponent
  ],
  providers: [AuthService,AuthGuard,NoAuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
