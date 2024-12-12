import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/interface';

import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  http = inject(HttpClient);
  public checkNetwork: boolean | undefined

  constructor() {
  }

  observeNetworkStatus(): Observable<any> {
    return new Observable((observer) => {
      let listener: PluginListenerHandle;

      const setupListener = async () => {
        const currentStatus = await Network.getStatus();
        observer.next(currentStatus);

        listener = await Network.addListener('networkStatusChange', (status) => {
          observer.next(status);
        });
      };

      setupListener();

      return async () => {
        if (listener) {
          await listener.remove();
        }
      };
    });
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}`).pipe(
      delay(3000)
    )
  }

  getProduct(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${environment.apiUrl}/${id}`);
  }

}
