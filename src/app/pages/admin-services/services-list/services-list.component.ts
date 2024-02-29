import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ServiceService } from 'src/app/services/services.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {

  Services:any = [];
  loading: boolean = true;

  constructor(private serviceService: ServiceService, private sanitizer: DomSanitizer) {
    this.readService();
  }
  ngOnInit() {}


  displayImage(imageData: any): SafeUrl {
    if (imageData && imageData.data && imageData.contentType) {
      const imageSrc = this.arrayBufferToBase64(imageData.data);
      return this.sanitizer.bypassSecurityTrustUrl(imageSrc);
    }

    // Retourner une image de substitution ou gérer le cas où l'image est manquante
    return '../assets/img/theme/bootstrap.jpg'; // Remplacez par le chemin de votre image de substitution
  }

  // Méthode d'aide pour convertir ArrayBuffer en base64
    arrayBufferToBase64(buffer: any): string {
      if (buffer && buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
        const binary = new Uint8Array(buffer.data);
        console.log(buffer.data);
        const base64 = btoa(String.fromCharCode.apply(null, binary));
        return `data:${buffer.contentType};base64,${base64}`;
      }

      return ''; // Retourner une chaîne vide en cas de problème avec les données
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
  removeService(service, index) {
    if(window.confirm('Are you sure?')) {
        this.serviceService.deleteService(service._id).subscribe((data) => {
          this.Services.splice(index, 1);
        }
      )
    }
  }
}
