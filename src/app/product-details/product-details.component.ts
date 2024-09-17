import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../product';
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product |null =null;
  similarProducts: Product[] = [];
  quantities: (number | string)[] = [...Array.from({ length: 10 }, (_, i) => i + 1), 'More'];
  selectedQuantity: number | string = 1;
  customQuantity: number | null = null;
  notificationMessage: string = '';
  productQuantityInCart: number = 0;
  warenkorbId: number | null = null;
  warenkorbIdStr: string | null = null;
  isModalOpen: boolean = false;
  modalImageSrc: string = '';




  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    this.warenkorbIdStr = localStorage.getItem('warenkorbId');
    this.warenkorbId = this.warenkorbIdStr !== null ? parseInt(this.warenkorbIdStr, 10) : null;
    this.route.paramMap.subscribe(params => {
      const productId = +params.get('id')!;
      if (productId) {
        this.productService.getProduct(productId).subscribe(product => {
          this.product = product;
          this.selectedQuantity = 1; // Reset quantity to 1
          this.fetchSimilarProducts(product.category);
          this.updateProductQuantityInCart(productId);
        });
      }
    });
  }


  private updateProductQuantityInCart(productId: number): void {
    this.cartService.getCartDetails(this.warenkorbId).subscribe(cartResponse => {
      const productInCart = cartResponse.cartItems.find(item => item.product.id === productId);
      this.productQuantityInCart = productInCart ? productInCart.quantity : 0;
    });
  }
  fetchSimilarProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe(products => {
      this.similarProducts = products.filter(p => p.id !== this.product?.id);
    });
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]).then(() => {
      window.location.reload();
    });
  }
  addToCart(): void {
    const quantity = this.selectedQuantity === 'More' ? Number(this.customQuantity) : Number(this.selectedQuantity);
    if (this.product && quantity) {
      const tempId = this.product.id;
      this.cartService.addToCart(this.product.id, quantity, this.warenkorbId).subscribe(
        response => {
          this.notificationMessage = `${this.product?.name} wurde erfolgreich in den Warenkorb gelegt!`;
          this.updateProductQuantityInCart(tempId);
          setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
        },
        error => {
          this.notificationMessage = 'Melden Sie sich an, um das Produkt in den Wagen zu legen';
          setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
        }
      );
    }
  }
  openModal(imageSrc: string): void {
    this.modalImageSrc = imageSrc;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
