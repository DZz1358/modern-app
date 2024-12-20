import { Routes } from '@angular/router';
import { HomePage } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'product/:id',
    component: DetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
];
