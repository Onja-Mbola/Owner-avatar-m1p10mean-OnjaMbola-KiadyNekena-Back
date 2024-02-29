import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from '../../services/token-storage.service';
import { passwordStrengthValidator } from '../../helpers/password-strength.validator';
import { ToastService } from '../../toast/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;

  submitted = false;
  loginForm: FormGroup;

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    public toastService: ToastService
    ) {
      this.mainForm();
     }
     mainForm() {
      this.loginForm = this.fb.group({
        email: [
          '',
          [
             Validators.required,
             Validators.email,
          ],
       ],
        password: ['', [Validators.required]],
      });
    }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }
  get myForm() {
    return this.loginForm.controls;
  }
	showSuccess(text) {
		this.toastService.show(text, { classname: 'alert-success  m-3 p-3 ', delay: 10000 });
	}

	showDanger(dangerTpl) {
		this.toastService.show(dangerTpl, { classname: 'alert-danger m-3 p-3', delay: 15000 });
	}

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (!this.loginForm.valid) {
      console.log('Le formulaire n\'est pas valide. État des contrôles :', this.loginForm);
      return false;
    } else {
      const formData = { ...this.loginForm.value };
      console.log(formData);
      return this.authService.loginClient(formData).subscribe({
        next: (data) => {
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;

          // this.roles = this.tokenStorage.getUser().roles;
          // this.reloadPage();
          window.location.href='/';
          this.loading = false;

          console.log('Next level created!');
          // Redirect to home ("/") route
            // this.ngZone.run(() => {
            //     this.router.navigateByUrl('/dashboard');
            //     this.showSuccess("Vous etes connecte");
            // });
        },
        error: (e) => {
          this.errorMessage = e.message;
          this.isLoginFailed = true;
          this.loading =false;
          console.error(e);
          // alert('erreur'+e.error.message);
          this.showDanger(e.error.message);
        },
      });
    }

  }
  navigateToExternalLink() {

    window.location.href = 'http://localhost:4200/';
}
  reloadPage(): void {
    window.location.reload();
  }

}
