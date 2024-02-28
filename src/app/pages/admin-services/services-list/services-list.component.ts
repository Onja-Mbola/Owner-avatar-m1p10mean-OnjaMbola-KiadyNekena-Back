import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/services.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {

  Services:any = [];
  loading: boolean = true;

  constructor(private serviceService: ServiceService) {
    this.readService();
  }
  ngOnInit() {}
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
  removeService(service, index) {
    if(window.confirm('Are you sure?')) {
        this.serviceService.deleteService(service._id).subscribe((data) => {
          this.Services.splice(index, 1);
        }
      )
    }
  }
}
