// communication.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private scrollUploadComponentSource = new Subject<void>();
  scrollUploadComponent$ = this.scrollUploadComponentSource.asObservable();

  constructor() { }

  triggerScrollUploadComponent() {
    this.scrollUploadComponentSource.next();
  }
}
