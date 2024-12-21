import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/interface';
import { NetworkService } from './network.service';
import { StorageService } from '../services/storage.service';
import { delay, map } from 'rxjs/operators';



@Injectable()

export class ProductsService implements OnInit {
  http = inject(HttpClient);
  networkService = inject(NetworkService);
  storageService = inject(StorageService);

  private isConnected: boolean | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  public subscribeToNetworkStatus(): void {
    this.networkService.getCurrentNetworkStatus().subscribe((status) => {
      this.isConnected = status.connected;
    });
  }

  getProducts(): Observable<IProduct[]> {

    if (this.isConnected) {
      return this.http.get<IProduct[]>(`${environment.apiUrl}`).pipe(
        delay(1000)
      )
    } else {
      return from(this.storageService.getFromStorage('products'));
    }
  }


  getProduct(id: string): Observable<IProduct> {
    if (this.isConnected) {
      return this.http.get<IProduct>(`${environment.apiUrl}/${id}`);
    } else {
      const products$ = from(this.storageService.getFromStorage('products'));

      return products$.pipe(
        map((products: IProduct[]) => {
          const product = products.find(product => product.id === +id);
          if (!product) {
            throw new Error(`Product with id ${id} not found`);
          }
          return product;
        })
      );
    }
  }

}
