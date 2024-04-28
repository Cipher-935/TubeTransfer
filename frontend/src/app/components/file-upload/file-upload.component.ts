import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent 
{
    constructor(private router:Router){}

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

    onGoToFormsClick()
    {
        this.router.navigate(['/forms']);
    }
}
