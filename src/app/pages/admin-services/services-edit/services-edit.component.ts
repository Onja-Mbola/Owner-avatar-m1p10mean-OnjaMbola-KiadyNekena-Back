import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/model/service';
import { ServiceService } from 'src/app/services/services.service';
import { ToastService } from 'src/app/toast/toast.service';

@Component({
  selector: 'app-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent implements OnInit {

  submitted = false;
  editForm: FormGroup;
  serviceData: Service[];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ServiceService,
    private router: Router,
    private ngZone: NgZone,
    public toastService: ToastService,
  ) {}
  ngOnInit() {
    this.updateService();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getService(id);
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      time: ['', [Validators.required]],
    });
  }
  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }
  getService(id) {
    this.apiService.getService(id).subscribe((data) => {
      this.editForm.setValue({
        name: data.name,
        price: data.price,
        time: data.time,
      });
    });
  }
  updateService() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      time: ['', [Validators.required]],
    });
  }

  showSuccess(text) {
		this.toastService.show(text, { classname: 'bg-success text-light m-3 p-3 ', delay: 10000 });
	}

	showDanger(dangerTpl) {
		this.toastService.show(dangerTpl, { classname: 'alert-danger text-light  m-3 p-3', delay: 15000 });
	}
  onSubmit() {
    this.submitted = true;

    if (!this.editForm.valid) {
      return false;
    } else {
      const formData = { ...this.editForm.value };
      let id = this.actRoute.snapshot.paramMap.get('id');
      if (window.confirm('Are you sure?')) {
        return this.apiService.updateService(id,formData).subscribe({
          complete: () => {
            console.log('Next level created!'),
            // Redirect to home ("/") route
              this.ngZone.run(() => {
                  // window.location.reload();
                  this.router.navigateByUrl('/services-admin')

                  // Display an alert after redirection
                  // alert('Verify your email.'); // You might want to use a more user-friendly notification method
                  this.showSuccess("Service modifie");
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

}
