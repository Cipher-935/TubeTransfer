import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent {
    descIsOpened: boolean = false;

    OpenDescription()
    {
        this.descIsOpened = true;
    }

    CloseDescription()
    {
        console.log("HERE");
        this.descIsOpened = false;
    }
}
