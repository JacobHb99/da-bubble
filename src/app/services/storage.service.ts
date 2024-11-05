import { inject, Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = inject(Storage);

  uploadFile(filePath: string, file: File): Observable<string> {
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable(observer => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Hier könntest du Fortschritts-Updates hinzufügen
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => observer.error(error),
        () => {
          // Bei Erfolg die Download-URL abrufen
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            observer.next(downloadURL);
            observer.complete();
          }).catch(error => observer.error(error));
        }
      );
    });
  }


}
