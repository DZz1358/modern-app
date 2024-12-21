import { Component, inject, OnInit } from '@angular/core';
import { IonBackButton, IonHeader, IonButtons, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonFooter, IonButton } from "@ionic/angular/standalone";
import { debounceTime } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { NetworkService } from '../services/network.service';
import { ToastController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  providers: [ProductsService],
  imports: [IonButton, IonBadge, IonFooter, IonLabel, IonSkeletonText, IonAvatar, IonList, IonItem, IonContent, IonTitle, IonToolbar, IonButtons, IonHeader, IonBackButton, RouterModule, CurrencyPipe]
})
export class CartComponent implements OnInit {
  cartService = inject(CartService)
  storageService = inject(StorageService)
  productService = inject(ProductsService)
  networkService = inject(NetworkService);
  toastController = inject(ToastController);

  cart$!: Observable<any>;
  public cartProducts: any = []
  public totalPrice = 0;
  public dummyArray = new Array(5);
  public isLoading = false;
  public networkStatus: any
  private networkSubscription!: Subscription;

  ngOnInit(): void {
    this.loadCart();
    this.networkSubscription = this.networkService.observeNetworkStatus().subscribe((status) => {
      this.networkStatus = status.connected;
    });
  }

  private loadCart() {
    this.isLoading = true;
    this.cart$ = this.cartService.getCart();
    this.cart$.pipe(
      debounceTime(2000)
    )
      .subscribe((cart) => {
        this.cartProducts = (cart as any).products
        this.isLoading = false;
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

  clearStorage() {
    this.storageService.removeFromStorage('cart')
  }

  checkStorage() {
    console.log('this.getFromStorage', this.storageService.getFromStorage('queue'))
  }

  async sendRequest() {
    const storageCart: any[] = [];
    storageCart.push(this.cartProducts);
    const currentQueue = await this.storageService.getFromStorage('queue')
    console.log('currentQueue', currentQueue)
    if (this.networkStatus) {
      // logic for send request
      this.cartService.clearCurrentCart();
      this.presentToast('top', this.networkStatus, 'request with connection');
    } else {
      if (currentQueue && currentQueue.length > 0) {
        currentQueue.push(this.cartProducts)
        this.storageService.setToStorage('queue', currentQueue)
        this.presentToast('top', this.networkStatus, 'request withOUT connection add to store');
        this.cartService.clearCurrentCart();
      } else {
        this.storageService.setToStorage('queue', storageCart);
        this.cartService.clearCurrentCart();
        this.presentToast('top', this.networkStatus, 'request withOUT connection and create store');

      }
    }
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', status: boolean, decs?: string,) {
    const currentStatus = status ? 'online' : 'offline';

    const toast = await this.toastController.create({
      message: `We are ${currentStatus}, ${decs}`,
      duration: 3000,
      position: position,
    });

    await toast.present();
  }


}
