// src/app/Profile.ts
import {Product} from "./product";

export interface Profile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  warenkorbId: string;


  lastUsedAddress: Address;
  bestellungen: Bestellung[];
}

export interface Address {
  // Define the fields for the Address interface based on your backend model
  street: string;
  city: string;
  postalCode: string;
  country: string;
  houseNumber: string;
  addressfirstName: string;
  addresslastName: string;
}

export interface Bestellung {
  // Define the fields for the Bestellung interface based on your backend model
  id: number;
  address:Address;
  paymentMethod: string;
  total: number;
  orderDateTime:string;
  bestellungsCart: BestellungsCart;
}
export interface BestellungsCart {
  bestellungsCartItems: BestellungsCartItem[]
}
export interface BestellungsCartItem {
  product: Product;
  quantity: number;
  price: number;
}
