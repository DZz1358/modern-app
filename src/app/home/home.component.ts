import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonButton } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { logoIonic, cartOutline } from 'ionicons/icons';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
import { NetworkService } from '../services/network.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  providers: [ProductsService],
  imports: [IonButton, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonSkeletonText, IonAlert, RouterModule, IonLabel, IonBadge, CurrencyPipe, IonIcon],
})
export class HomePage implements OnInit {
  productsService = inject(ProductsService);
  storageService = inject(StorageService);
  networkService = inject(NetworkService);
  cartService = inject(CartService)

  public isLoading = false;
  public products: any[] = [];
  public error = null;
  public dummyArray = new Array(9);
  cart$!: Observable<any>;
  public cartProducts: any = []

  constructor() {
    addIcons({ cartOutline, logoIonic });
  }

  ngOnInit(): void {
    this.getProductList();
    this.loadCart();
  }

  getProductList() {
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
          if (res) {
            this.products.push(...res);
            this.storageService.setToStorage('products', res);
          }
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
