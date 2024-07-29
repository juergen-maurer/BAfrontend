// Define an interface for the response structure
import {Product} from "./product";

export interface CartResponse {
  cartItems: {
    id: number;
    product: Product;
    quantity: number;
  }[];
}
