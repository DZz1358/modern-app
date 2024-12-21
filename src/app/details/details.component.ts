import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar, IonButton, IonSkeletonText, IonListHeader, IonThumbnail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, addOutline, removeOutline, starOutline } from 'ionicons/icons';
import { Observable, Subject } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { IProduct } from '../models/interface';
import { StorageService } from '../services/storage.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [IonListHeader, IonSkeletonText,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonItem,
    CurrencyPipe,
    IonThumbnail
  ],
})
export class DetailsComponent implements OnInit {
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  storageService = inject(StorageService);
  cartService = inject(CartService)
  cart$!: Observable<any>;
  public cartProducts: any = {}
  public totalPrice = 0
  public isLoading = false;


  private id!: string;
  public product: IProduct = {} as IProduct;
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({ removeOutline, addOutline, cashOutline, starOutline });
  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.isLoading = true;

      this.productsService.getProduct(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((product) => {
          this.product = product;
          this.isLoading = false;
        });
    }
    this.loadCart();
  }

  private loadCart() {
    this.cart$ = this.cartService.getCart();
    this.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
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

}
