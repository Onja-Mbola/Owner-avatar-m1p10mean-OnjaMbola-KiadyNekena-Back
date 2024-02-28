import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthGuard } from 'src/app/auth.guard';
import { DashboardAdminComponent } from 'src/app/pages/dashboard-admin/dashboard-admin.component';
import { ClientGuard } from 'src/app/client.guard';
import { AdminGuard } from 'src/app/admin.guard';
import { ServicesListComponent } from 'src/app/pages/admin-services/services-list/services-list.component';
import { ServicesCreateComponent } from 'src/app/pages/admin-services/services-create/services-create.component';
import { ServicesEditComponent } from 'src/app/pages/admin-services/services-edit/services-edit.component';
import { EmployeListComponent } from 'src/app/pages/admin-employe/employe-list/employe-list.component';
import { EmployeCreateComponent } from 'src/app/pages/admin-employe/employe-create/employe-create.component';
import { EmployeEditComponent } from 'src/app/pages/admin-employe/employe-edit/employe-edit.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent , canActivate: [AuthGuard,ClientGuard]},
    { path: 'dashboard-admin',component: DashboardAdminComponent , canActivate: [AuthGuard,AdminGuard]},
    { path: 'user-profile',   component: UserProfileComponent , canActivate: [AuthGuard]},
    { path: 'services-admin',         component: ServicesListComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'services-admin/create',         component: ServicesCreateComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'services-admin/edit/:id',         component: ServicesEditComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'employe-admin',         component: EmployeListComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'employe-admin/create',         component: EmployeCreateComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'employe-admin/edit/:id',         component: EmployeEditComponent, canActivate: [AuthGuard,AdminGuard] },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent }
];
