import { PluginListenerHandle } from '@capacitor/core';
import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionStatus, Network } from '@capacitor/network';


@Injectable({
  providedIn: 'any'
})
export class NetworkService implements OnInit {

  public status: BehaviorSubject<any> = new BehaviorSubject<any>(true);

  constructor() {
  }

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
