import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Accueil',  icon: 'ni-tv-2 text-primary', class: '' },

];
export const AROUTES: RouteInfo[] = [
  { path: '/dashboard-admin', title: 'Tableau de bord',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/services-admin', title: 'Service',  icon: 'ni-tv-2 text-primary', class: '' },
];
export const EROUTES: RouteInfo[] = [
  { path: '/dashboard-admin', title: 'Tableau de bord',  icon: 'ni-tv-2 text-primary', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public role: any;
  currentUser: any;


  constructor(private router: Router,private token: TokenStorageService) { }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    if(this.currentUser.role){
      this.menuItems = AROUTES.filter(menuItem => menuItem);
    } else{
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  logout(): void {
    this.token.signOut();
    // window.location.reload();
    window.location.href="/"
  }

}
