export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  originalQuantity?: number;
  category: string;
  cleanCategory: string;
}
