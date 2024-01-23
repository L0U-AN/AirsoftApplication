import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storageModule: AngularFireStorage) {}

  //store image on firebase storage
  uploadImage(filePath: string, file: any) {
    return this.storageModule.upload(filePath, file).then((res) => res.ref.getDownloadURL());
  }
}
