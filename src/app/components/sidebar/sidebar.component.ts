import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

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
  { path: '/employe-admin', title: 'Employe',  icon: 'fa fa-user text-primary', class: '' },
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
  imageSource: string;

  public menuItems: any[];
  public isCollapsed = true;
  public role: any;
  currentUser: any;

  constructor(private router: Router,private token: TokenStorageService, private userService: UserService ) { }

  ngOnInit() {
    this.loadImage();
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

  loadImage(): void {
    this.userService.loadImage().subscribe(
      (imageSource) => {
        this.imageSource = imageSource;
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image dans le composant :', error);
      }
    );
  }

  logout(): void {
    this.token.signOut();
    // window.location.reload();
    window.location.href="/"
  }

}
