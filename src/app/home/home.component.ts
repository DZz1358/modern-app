import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../service/products.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonBackButton, IonButtons, IonButton } from '@ionic/angular/standalone';
import { catchError, finalize, Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { logoIonic, cart, cartOutline } from 'ionicons/icons';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonSkeletonText, IonAlert, RouterModule, IonLabel, IonBadge, CurrencyPipe, IonIcon],
})
export class HomePage implements OnInit {
  productsService = inject(ProductsService);
  public isLoading = false;
  public products: any[] = [];
  public error = null;
  public dummyArray = new Array(9);
  cartService = inject(CartService)
  cart$!: Observable<any>;
  public cartProducts: any = []



  constructor() {
    addIcons({ cartOutline, logoIonic });
  }
  ngOnInit(): void {
    this.getProductList();
    this.loadCart();
  }

  async getProductList() {
    this.isLoading = true;

    this.productsService.getProducts()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('res', res)
          this.products.push(...res);
        }
      })
  }


  private loadCart() {
    this.cart$ = this.cartService.getCart();
    this.cart$.subscribe((cart) => {
      this.cartProducts = cart.products
    })
  }


}
