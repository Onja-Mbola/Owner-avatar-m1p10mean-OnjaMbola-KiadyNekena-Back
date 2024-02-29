import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ServiceService } from 'src/app/services/services.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ToastService } from 'src/app/toast/toast.service';

@Component({
  selector: 'app-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {

  submitted = false;
  serviceForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private serviceService: ServiceService,
    public toastService: ToastService,
    private token: TokenStorageService,
    private http: HttpClient,



  ) {
    this.mainForm();
  }
  ngOnInit() {}
  mainForm() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      time: ['', [Validators.required, ]],
      image: [null, [Validators.required]]
    });
  }
  // Choose designation with select dropdown
  updateProfile(e) {
    this.serviceForm.get('designation').setValue(e, {
      onlySelf: true,
    });
  }

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null;

  onFileChange(event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.file = file;  // Stockez la référence du fichier dans votre composant
      this.serviceForm.get('image').setValue(file.name);  // Affichez le nom du fichier dans le formulaire si nécessaire
      this.serviceForm.get('image').updateValueAndValidity();
    }
  }



  // Getter to access form control
  get myForm() {
    return this.serviceForm.controls;
  }
  showSuccess(text) {
		this.toastService.show(text, { classname: 'bg-success text-light m-3 p-3 ', delay: 10000 });
	}

	showDanger(dangerTpl) {
		this.toastService.show(dangerTpl, { classname: 'alert-danger text-light  m-3 p-3', delay: 15000 });
	}
  // onSubmit() {
  //   this.submitted = true;
  //   if (!this.serviceForm.valid) {
  //     return false;
  //   } else {
  //     return this.serviceService.createService(this.serviceForm.value).subscribe({
  //       complete: () => {
  //         console.log('Service successfully created!'),
  //           this.ngZone.run(() => this.router.navigateByUrl('/services-admin'));
  //           this.showSuccess("Service cree");
  //       },
  //       error: (e) => {
  //         console.log(e);
  //         this.showDanger(e.error.message);
  //       },
  //     });
  //   }
  // }





  onSubmit() {
    this.submitted = true;

    if (!this.serviceForm.valid) {
      return false;
    } else {

      let formData = new FormData();
      formData.append('name', this.serviceForm.get('name').value);
      formData.append('price', this.serviceForm.get('price').value);
      formData.append('time', this.serviceForm.get('time').value);

      if (this.file) {
        formData.append('file', this.file, this.file.name);
      }
        return this.serviceService.createService(formData).subscribe({
          complete: () => {
            console.log('Next level created!'),
            // Redirect to home ("/") route
              this.ngZone.run(() => {
                  // window.location.reload();
                  this.router.navigateByUrl('/services-admin')

                  // Display an alert after redirection
                  // alert('Verify your email.'); // You might want to use a more user-friendly notification method
                  this.showSuccess("Service cree");
              });
          },
          error: (e) => {
            console.log(e);
            this.showDanger(e.error.message);
          },
        });
    }
  }
}
