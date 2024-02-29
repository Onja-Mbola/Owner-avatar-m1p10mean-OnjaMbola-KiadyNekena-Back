import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator } from '../../helpers/password-strength.validator';
import { phoneNumberValidator } from '../../helpers/phone-number.validator';
import { ToastService } from '../../toast/toast.service';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    submitted = false;
    profileForm: FormGroup;
    imageSource: string;

    test : Date = new Date();
    focus;
    focus1;
    focus2;
    model: any;
    currentUser: any;
    trydata: any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private userService: UserService,
    public toastService: ToastService,
    private token: TokenStorageService,
    private http: HttpClient


    ) {}

   ngOnInit() {
    this.loadImage();
    this.currentUser = this.token.getUser();
    this.updateProfile();
    this.getMyProfile();
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: [
            '',
            [
               Validators.required,
               Validators.email,
            ],
         ],
          address: ['', [Validators.required]],
          phoneNumber: ['', [Validators.required, phoneNumberValidator]],
    });
  }



  //modification photo de profil
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    // Traitez le fichier comme vous le souhaitez, par exemple, téléchargez-le sur le serveur, etc.
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

  updateProfile() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: [
            '',
            [
               Validators.required,
               Validators.email,
            ],
         ],
          address: ['', [Validators.required]],
          phoneNumber: ['', [Validators.required, phoneNumberValidator]],
    });
  }
   getMyProfile(){
    this.userService.getProfile().subscribe((data) => {
      this.trydata = data;
      this.profileForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
      });
    });
    // try {
    //   this.userdata = await this.user.getProfile().toPromise();
    // } catch (e) {
    //   console.error(e);
    //   // Handle error as needed
    //   // this.showDanger(e.error.message);
    // }
  }
  showSuccess(text) {
		this.toastService.show(text, { classname: 'bg-success text-light m-3 p-3 ', delay: 10000 });
	}

	showDanger(dangerTpl) {
		this.toastService.show(dangerTpl, { classname: 'alert-danger text-light  m-3 p-3', delay: 15000 });
	}
  get myForm() {
    return this.profileForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.profileForm.valid) {
      console.log('Le formulaire n\'est pas valide. État des contrôles :', this.profileForm);
      return false;
    } else {



      const formData = { ...this.profileForm.value };

      return this.userService.updateProfile(formData).subscribe({
        complete: () => {
          console.log('Next level created!'),
          // Redirect to home ("/") route
            this.ngZone.run(() => {
                // window.location.reload();
                this.router.navigateByUrl('/user-profile')

                // Display an alert after redirection
                // alert('Verify your email.'); // You might want to use a more user-friendly notification method
                this.showSuccess("Votre profil a ete modifie");
            });
        },
        error: (e) => {
          console.log(e);
          this.showDanger(e.error.message);
        },
      });
    }
  }

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();
      let upload$;

      const headers = {
        Authorization: 'Bearer ' + this.token.getToken(), // Replace yourAccessToken with the actual token
      };

      formData.append('file', this.file, this.file.name);
      if(!this.token.getUser().role){
         upload$ = this.http.put("http://localhost:3000/api/auth/uploadPhotoClient", formData, { headers });
      } else{
         upload$ = this.http.put("http://localhost:3000/api/auth/uploadPhotoEmploye", formData, { headers });
      }


      this.status = 'uploading';

      upload$.subscribe({
        next: () => {
          this.status = 'success';
        },
        error: (error: any) => {
          this.status = 'fail';
          return throwError(() => error);
        },
      });
    }
  }


}
