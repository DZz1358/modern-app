import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { catchError, concatMap, delay, filter, from, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Injectable()

export class QueueService {
  storageService = inject(StorageService);
  http = inject(HttpClient);
  toastController = inject(ToastController);

  constructor() { }

  async processQueue() {
    const currentQueue = await this.storageService.getFromStorage('queue')

    if (currentQueue && currentQueue.length > 0) {
      console.log('currentQueue', currentQueue)
      this.processObjectsSequentially(currentQueue);
    }
  }


  processObjectsSequentially(objects: any[]): void {
    console.log('objects', objects)
    from(objects)
      .pipe(
        filter(obj => !!this.handleRequest(obj)),
        concatMap((obj, index) => this.handleRequest(obj).pipe(
          delay(3000),
          // retry(2), for retrying the request
          catchError((error) => {
            console.error(`Error occurred at index ${index + 1}:`, error);
            return throwError(() => error);
          }),
          tap(() => {
            this.presentToast('middle', `Processed object at index ${index + 1}`);
            console.log(`Processed object at index ${index}`)
          })

        )),
      )
      .subscribe({
        next: () => {
          console.log('Object processed successfully')
        },
        error: (err) => console.error('Processing stopped due to error:', err),
        complete: () => console.log('All objects processed successfully')
      });
  }


  private handleRequest(obj: any): Observable<any> {
    switch (obj.type) {
      case 'type1':
        return this.http.post('/api/type1', obj.payload);
      case 'type2':
        return this.http.get(`/api/type2/${obj.id}`);
      default:
        return of(null);
    }
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', message?: string) {

    const toast = await this.toastController.create({
      message: message ? message : `Your request from queue has been processed`,
      duration: 3500,
      position: position,
    });

    await toast.present();
  }
}
