import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {


  public status: BehaviorSubject<any> = new BehaviorSubject<any>(true);

  ngOnInit(): void {
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

  updateConnection(status: any) {
    this.status.next(status);
  }


  public getCurrentNetworkStatus() {
    return this.status.asObservable();
  }

}
