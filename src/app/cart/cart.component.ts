import { Component, inject, OnInit } from '@angular/core';
import { IonBackButton, IonHeader, IonButtons, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonFooter } from "@ionic/angular/standalone";
import { debounceTime, Observable } from 'rxjs';
import { CartService } from '../service/cart.service';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [IonFooter, IonBadge, IonLabel, IonAlert, IonSkeletonText, IonAvatar, IonList, IonItem, IonContent, IonTitle, IonToolbar, IonButtons, IonHeader, IonBackButton, RouterModule, CurrencyPipe]
})
export class CartComponent implements OnInit {
  cartService = inject(CartService)
  cart$!: Observable<any>;
  public cartProducts: any = []
  public totalPrice = 0;
  public dummyArray = new Array(5);
  public isLoading = false;


  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart() {
    this.isLoading = true;
    this.cart$ = this.cartService.getCart();
    this.cart$.pipe(
      debounceTime(2000)
    )
      .subscribe((cart) => {
        this.cartProducts = cart.products
        this.isLoading = false;

        // if (this.cartProducts) {
        //   this.totalPrice = this.cartProducts.reduce((acc: any, curr: any) => acc + (+curr.price * curr.count), 0)
        //     .toFixed(2)
        // }
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
