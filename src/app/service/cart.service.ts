import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public storageCartsSubject = new BehaviorSubject<any>({});


  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      this.storageCartsSubject.next(cart);
    }
  }

  private saveCartToLocalStorage(cart: any) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  public getCart() {
    return this.storageCartsSubject.asObservable();
  }

  addToCart(item: any) {
    let currentCart = this.storageCartsSubject.value;

    if (!currentCart || !currentCart.products) {
      currentCart = {
        products: [],
      };
    }

    const products = currentCart.products;
    const existingProduct = products.find((product: any) => product.id === item.id);

    if (existingProduct) {
      existingProduct.count++;
    } else {
      products.push({
        ...item,
        count: 1
      });
    }

    currentCart.updatedAt = new Date().toISOString();
    this.storageCartsSubject.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
  }


  removeFromCart(productId: number) {
    const currentCart = this.storageCartsSubject.value;
    const products = currentCart.products;

    const productIndex = products.findIndex((product: any) => product.id === productId);

    if (productIndex === -1) return;

    if (products[productIndex].count > 1) {
      products[productIndex].count--;
    } else {
      products.splice(productIndex, 1);
    }

    this.storageCartsSubject.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
  }



  clearCurrentCart() {
    let currentCart = this.storageCartsSubject.value;
    if (currentCart) {
      currentCart = {};
      this.saveCartToLocalStorage(currentCart);
      this.storageCartsSubject.next(currentCart);
    }
  }

}
