import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = inject(Storage);


  initStorage() {
    this.storage.create();
  }

  setToStorage(key: string, value: any) {
    this.storage.set(key, value);
  }

  async getFromStorage(key: string) {
    return await this.storage.get(key).then(res => res);
  }

  removeFromStorage(key: string) {
    this.storage.remove(key);
  }
}
