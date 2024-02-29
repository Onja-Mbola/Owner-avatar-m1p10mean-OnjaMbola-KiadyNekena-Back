import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/toast/toast.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  public count:number = 0;
  public isOpen:boolean =false;
  public previewFlag:boolean = false;
  public inVoiceNo :number;

  Employe:any = [];
  loading: boolean = true;

  submitted = false;
  rdvForm: FormGroup;

  date: any;
  time: any;
  emp: any;



  constructor(
    private cartService:CartService,
    private apiService: UserService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    public toastService: ToastService,

    ) {
      this.mainForm();
      this.readEmploye();
  }

  ngOnInit() {

    this.cartService.cartUpdates$.subscribe(()=>{
      this.count= this.cartService.count;
    });
  }

  mainForm() {
    this.rdvForm = this.fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      employe: ['', [Validators.required, ]],
    });
  }

  updateEmploye(e) {
    this.rdvForm.get('employe').setValue(e, {
      onlySelf: true,
    });
  }


  readEmploye(){
    this.apiService.getEmploye().subscribe((data) => {
     this.Employe = data;
     this.loading = false;
    }),
    (error) => {
      console.error('Error fetching services:', error);
      this.loading = false; // Set loading to false on error as well
    }
  }

  public openCart():void{
    this.isOpen = true;
  }
  public closeCart():void{
    this.isOpen = false;
    this.previewFlag = false;
  }
  public removeProduct(item) :void{
    console.log(this.cartService)
    this.cartService.cartItems.splice(this.cartService.cartItems.findIndex(element=>item.id === element.id),1);
    this.count= this.cartService.count;
  }
  public chngQuantity():void{
    this.count= this.cartService.count;
  }
  public preview() :void{
    this.previewFlag = true;
    this.inVoiceNo = this.getRandomInt(23443, 23432555);
  }

  public calculate(price,quantity){
    return price*quantity;
  }
  calculateTotal(): number {
    let total = 0;
    for (const item of this.cartService.cartItems) {
      total += this.calculate(item.price, item.qty);
    }
    return total;
  }

  get myForm() {
    return this.rdvForm.controls;
  }


  public getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    showSuccess(text) {
      this.toastService.show(text, { classname: 'bg-success text-light m-3 p-3 ', delay: 10000 });
    }

    showDanger(dangerTpl) {
      this.toastService.show(dangerTpl, { classname: 'alert-danger text-light  m-3 p-3', delay: 15000 });
    }

    onSubmit() {
      this.submitted = true;

      if (!this.rdvForm.valid) {
        return false;
      } else {
        const formData = { ...this.rdvForm.value };
        console.log(formData);
        console.log(this.cartService);
          // return this.apiService.createRDV(formData).subscribe({
          //   complete: () => {
          //     console.log('Next level created!'),
          //     // Redirect to home ("/") route
          //       this.ngZone.run(() => {
          //           // window.location.reload();
          //           this.router.navigateByUrl('/services-admin')

          //           // Display an alert after redirection
          //           // alert('Verify your email.'); // You might want to use a more user-friendly notification method
          //           this.showSuccess("Service cree");
          //       });
          //   },
          //   error: (e) => {
          //     console.log(e);
          //     this.showDanger(e.error.message);
          //   },
          // });
      }
    }
}
