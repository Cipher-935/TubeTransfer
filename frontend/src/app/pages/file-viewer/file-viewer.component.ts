import { Component } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent {
    descIsOpened: boolean = false;

    ToggleDescription()
    {
        this.descIsOpened = !this.descIsOpened;
    }
}
