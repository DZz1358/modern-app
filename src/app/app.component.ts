import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NetworkService } from './services/network.service';
import { ToastController } from '@ionic/angular';
import { ProductsService } from './services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  public networkStatus: any;
  networkService = inject(NetworkService);
  // storageService = inject(StorageService);
  toastController = inject(ToastController);
  productService = inject(ProductsService);

  private networkSubscription!: Subscription;

  constructor() { }

  ngOnInit() {
    // this.storageService.initStorage();
    this.networkSubscription = this.networkService.observeNetworkStatus().subscribe((status) => {
      this.networkStatus = status;
      this.networkService.updateConnection(status)
      this.presentToast('top', status.connected);
    });

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', status: boolean,) {
    const currentStatus = status ? 'online' : 'offline';

    const toast = await this.toastController.create({
      message: `We are ${currentStatus}`,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }



  ngOnDestroy(): void {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }
}
