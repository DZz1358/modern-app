import { Component, inject, OnInit } from '@angular/core';
import { IonBackButton, IonHeader, IonButtons, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonButtons, IonHeader, IonBackButton,]
})
export class CartComponent implements OnInit {
  cartService = inject(CartService)
  cart$!: Observable<any>;
  public cartProducts: any = {}
  public totalPrice = 0

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart() {
    this.cart$ = this.cartService.getCart();
    this.cart$.subscribe((cart) => {
      this.cartProducts = cart.products
      if (this.cartProducts) {
        this.totalPrice = this.cartProducts.reduce((acc: any, curr: any) => acc + (+curr.price * curr.count), 0)
          .toFixed(2)
      }
    })
  }


  initCount(product: any) {
    const match = this.cartProducts?.find((item: any) => item.id === product.id)
    return match ? match.count : 0;
  }


  increment(product: any) {
    this.cartService.addToCart(product)
  }

  decrement(productId: number) {
    this.cartService.removeFromCart(productId)
  }

  clearCart() {
    this.cartService.clearCurrentCart()
  }


}
