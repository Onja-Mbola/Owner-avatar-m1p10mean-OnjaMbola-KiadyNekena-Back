import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  imageSource: string;
  public focus;
  public listTitles: any[];
  public location: Location;
  currentUser: any;
  constructor(location: Location,  private element: ElementRef, private router: Router,private token: TokenStorageService,     private userService: UserService    ) {
    this.location = location;
  }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.loadImage();
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
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
