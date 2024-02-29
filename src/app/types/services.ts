export interface Service {
  id: number,
  name: string,
  price: number,
  time: number,
  image: string,
}

export interface CartServiceP extends Service {
 qty:number;
}
