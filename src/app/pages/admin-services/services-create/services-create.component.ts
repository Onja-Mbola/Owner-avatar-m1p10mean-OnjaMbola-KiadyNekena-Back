import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/services.service';

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
    private serviceService: ServiceService
  ) {
    this.mainForm();
  }
  ngOnInit() {}
  mainForm() {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      time: ['', [Validators.required, ]],
    });
  }
  // Choose designation with select dropdown
  updateProfile(e) {
    this.serviceForm.get('designation').setValue(e, {
      onlySelf: true,
    });
  }
  // Getter to access form control
  get myForm() {
    return this.serviceForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.serviceForm.valid) {
      return false;
    } else {
      return this.serviceService.createService(this.serviceForm.value).subscribe({
        complete: () => {
          console.log('Employee successfully created!'),
            this.ngZone.run(() => this.router.navigateByUrl('/employees-list'));
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
}
