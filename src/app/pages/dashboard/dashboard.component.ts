import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { ServiceService } from 'src/app/services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Service } from 'src/app/model/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Services:any = [];
  loading: boolean = true;


  constructor(
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService:CartService
    ) {
    this.readService();
  }
  ngOnInit() {
  }
  readService(){
    this.serviceService.getServices().subscribe((data) => {
     this.Services = data;
     this.loading = false;
    }),
    (error) => {
      console.error('Error fetching services:', error);
      this.loading = false; // Set loading to false on error as well
    }
  }


  private addToCart(service:Service) : void{

    console.log('here t');
    console.log(service);
    this.cartService.add(service);
 }

}
