import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadButtonClicked: EventEmitter<void> = new EventEmitter<void>();
}
