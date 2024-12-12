import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar, IonAvatar, IonBadge, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, calendarOutline, cartOutline, addOutline, removeOutline, starOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { IProduct } from '../models/interface';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [IonButton,
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
  ],
})
export class DetailsComponent implements OnInit {
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  cartService = inject(CartService)
  cart$!: Observable<any>;
  public cartProducts: any = {}
  public totalPrice = 0

  public product: WritableSignal<IProduct | null> = signal<IProduct | null>(
    null,
  );

  @Input()
  set id(productId: string) {
    this.productsService.getProduct(productId).subscribe((product) => {
      console.log('product', product)
      this.product.set(product);
    });
  }

  constructor() {
    addIcons({ removeOutline, addOutline, cashOutline, starOutline, cartOutline, calendarOutline, });
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', productId);
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


}
