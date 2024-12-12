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

  constructor() {
    this.getCurrentStatus()
  }

  async getCurrentStatus(): Promise<any> {
    return await Network.getStatus();
  }

  // Observable для отслеживания изменений сети
  observeNetworkStatus(): Observable<any> {
    return new Observable((observer) => {
      let listener: PluginListenerHandle;

      // Устанавливаем слушатель с использованием await
      const setupListener = async () => {
        listener = await Network.addListener('networkStatusChange', (status) => {
          observer.next(status); // Отправляем статус сети подписчикам
        });
      };

      setupListener();

      // Возвращаем метод очистки
      return async () => {
        if (listener) {
          await listener.remove(); // Убираем слушатель
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
