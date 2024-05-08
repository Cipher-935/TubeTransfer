import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, throttleTime } from 'rxjs';
import { UploadService } from '../../services/shared.service';

// Optional: Define an interface for the data sent to the backend
interface DeleteObject 
{
  main_key: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [HttpClientModule, CommonModule, VideoPlayerComponent, FormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent 
{
    constructor(private sanitizer: DomSanitizer, private router: Router,
    
    private uploadService: UploadService) {}

    isDraggingOver: boolean = false;
    fileIsSubmitted: boolean = false;

    fileName: string = "";
    fileDesc: string = "";
    fileExtensionName: string = "";
    fileSize: number = 0;
    fileCategory: string = "";

    newFileName: string = "";

    // To assign uploaded file
    uploadedFile: any;
    
    @Input()src!: SafeResourceUrl;

    @ViewChild('tooltip') tooltipElement: ElementRef | undefined;
    toolTipVisible: boolean = true;

    @Output() uploadButtonClicked: EventEmitter<void> = new EventEmitter<void>();

    hasButtonBeenClicked: boolean = false;

    updateCharacterCount(fieldName: string) 
    {
        if (fieldName === 'name') 
        {
            this.fileName = this.fileName.slice(0, 30); // Limit characters to 30
        }
        else if (fieldName === 'description') 
        {
            this.fileDesc = this.fileDesc.slice(0, 300); // Limit characters to 300
        } 
        else if (fieldName === 'category') 
        {
            this.fileCategory = this.fileCategory.slice(0, 20); // Limit characters to 20
        }
    }

    isNameEmptyOrWhitespace(): boolean
    {
        return this.fileName.trim() === '';
    }

    isDescriptionEmptyOrWhitespace(): boolean 
    {
        return this.fileDesc.trim() === '';
    }

    updateTooltipPosition(event: MouseEvent) 
    {
        event.stopPropagation();
        this.toolTipVisible = true;

        if (this.tooltipElement) 
        {
            const tooltip = this.tooltipElement.nativeElement;
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
        
            // Get cursor position relative to the document
            const cursorX = event.clientX;
            const cursorY = event.clientY;
        
            // Calculate tooltip position to avoid going off-screen
            let left = cursorX + 10; // Add an offset to position it slightly right of the cursor
            let top = cursorY + 10; // Add an offset to position it slightly below the cursor
        
            // Check if tooltip goes off-screen on the right side
            if (left + tooltipWidth > window.innerWidth) 
            {
                left = cursorX - tooltipWidth - 10; // Position it to the left of the cursor
            }
        
            // Check if tooltip goes off-screen on the bottom
            if (top + tooltipHeight > window.innerHeight) 
            {
                top = cursorY - tooltipHeight - 10; // Position it above the cursor
            }
        
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }
    }

    removeToolTip()
    {
        this.toolTipVisible = false;
    }

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

    onDropFile(event: any , dropped: boolean = true)
    {
        event.preventDefault();
        event.stopPropagation();

        this.isDraggingOver = false;

        let files;

        if(dropped)
        {
            files = event.dataTransfer?.files;
        }
        else
        {
            files = event.target.files;
        }

        console.log(files);
        if (files && files.length > 0)
        {
            console.log("Files dropped: ", files[0]);
            this.fileName = files[0].name.substring(0, files[0].name.lastIndexOf("."));
            this.fileSize = files[0].size;
            
            // Read file content
            this.readFIleContent(files[0]);
        }
    }

    // For detecting the file type and reading it accordingly
    readFIleContent(file: any)
    {
        const extension = file.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();

        this.fileExtensionName = "." + extension;

        switch(extension)
        {
            case 'exe':
            case 'zip':
            case '7z':
            case 'gz':
            case 'bat':
            case 'psl':
            case 'dat':
            {
                alert("File type not supported");
                break;
            }
            default:
            {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result as string; // Assuming fileContent is a base64-encoded string
                    console.log(dataUrl);

                    // Assuming this.sanitizer is from Angular's DomSanitizer
                    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl) as SafeResourceUrl;

                    this.fileIsSubmitted = true;

                    console.log(this.src);
                };
                reader.readAsDataURL(file);

                this.uploadedFile = file;
                
                break;
            }
        }
    }

    enableDeleteButton(value: string) 
    {
        const deleteButton = document.querySelector('#deleteButton');
        if (value) 
        {
            deleteButton?.removeAttribute('disabled');
        } 
        else 
        {
            deleteButton?.setAttribute('disabled', 'true');
        }
    }

    uploadFile = async (event: any, fileDesc:string) =>
    {
        event.preventDefault();

        this.hasButtonBeenClicked = true;

        this.uploadService.uploadButtonClicked.emit();

        const mfile = 
        {
            file_name: this.fileName + this.fileExtensionName, 
            file_mime: this.uploadedFile.type, 
            file_description: fileDesc, 
            file_category: this.fileCategory, 
            file_size: this.fileSize
        };

        const rec_put_link = await fetch("http://127.0.0.1:4000/upload",{
            method: "POST",
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(mfile)
        });
        if(rec_put_link.status === 200)
        {
            const final_url = await rec_put_link.json();
            const put_req = await fetch(final_url.resp, 
            {
                method: "PUT",
                headers: 
                {
                    "Content-Type": this.uploadedFile.type
                },
                body: this.uploadedFile
            });
            
            if(put_req.status === 200)
            {
                this.router.navigate(['/menu']);
            }
            else
            {
                alert("Something went wrong");
            }
        }
        else
        {
            const j_resp = await rec_put_link.json();
            alert(j_resp.resp);
        }
    }
}
