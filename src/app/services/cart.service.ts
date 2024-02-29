import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartServiceP } from '../types/services';
import { Service } from '../model/service';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  private cartUpdates = new Subject<string>();
  public cartUpdates$ = this.cartUpdates.asObservable();

  public cartItems:CartServiceP[] =[];
  public get count():number{
    return this.cartItems.reduce((c,t1) => t1.qty+c,0);

  };


  constructor() {

  }

add(service: Service) {
  // Check if the service is already in the cart
  let item: CartServiceP | undefined = this.cartItems.find(item => item.id == service._id);

  if (item) {
    item.qty++; // If the item is already in the cart, increment the quantity
  } else {
    // If the item is not in the cart, create a new CartServiceP object
    const cartItem: CartServiceP = {
      id: service._id,
      name: service.name, // Assuming you have a 'name' property in your Service class
      price: service.price, // Assuming you have a 'price' property in your Service class
      qty: 1,
      time: 0,
      image: ''
    };

    this.cartItems.push(cartItem);
  }

  this.cartUpdates.next('update');
}
}
