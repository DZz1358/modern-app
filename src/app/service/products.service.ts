import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from './interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  http = inject(HttpClient);

  constructor() { }


  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}`).pipe(
      delay(3000)
    )
  }

  getProduct(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${environment.apiUrl}/${id}`);
  }

}
