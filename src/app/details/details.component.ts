import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  IonToolbar, IonAvatar
} from '@ionic/angular/standalone'; import { ProductsService } from '../service/products.service';
import { IProduct } from '../service/interface';
import { addIcons } from 'ionicons';
import { cashOutline, calendarOutline } from 'ionicons/icons';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [IonAvatar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
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
  public product: WritableSignal<IProduct | null> = signal<IProduct | null>(
    null,
  );

  @Input()
  set id(productId: string) {
    this.productsService.getProduct(productId).subscribe((product) => {
      this.product.set(product);
    });
  }

  constructor() {
    addIcons({
      cashOutline,
      calendarOutline,
    });
  }

  ngOnInit() { }

}
