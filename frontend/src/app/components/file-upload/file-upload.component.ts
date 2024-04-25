import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent 
{
    isDraggingOver: boolean = false;

    onDragOver(event: DragEvent) 
    {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer!.dropEffect = 'copy';
        this.isDraggingOver = true;
      }
      
      onDragLeave(event: DragEvent) 
      {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingOver = false;
      }
}
