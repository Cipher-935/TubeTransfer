import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent 
{
    constructor(private router: Router, private dataService: DataService, private sanitizer: DomSanitizer) {}

    descIsOpened: boolean = false;

    // To assign uploaded file
    uploadedFile: any;

    // File data variables
    file: any;
    fileName: string = "File name";
    fileDesc: string = "";
    fileDate: string = "";
    fileCategory: string = "";
    fileSize: number = 0;
    fileOwner: string = "";
    @Input()src!: SafeResourceUrl;

    ngOnInit()
    {
        this.dataService.data$.subscribe(data =>
        {
            // To check if this page was visited correctly
            if (!data)
            {
                this.router.navigate(['/menu']);
                return;
            }

            this.file = data;
            this.displayFileContents();
        });
    }

    openDescription()
    {
        this.descIsOpened = true;
    }

    closeDescription()
    {
        console.log("HERE");
        this.descIsOpened = false;
    }

    goBack()
    {
        this.router.navigate(['/menu'], { queryParams: { component: 'dashboard' } });
    }

    displayFileContents()
    {
        this.fileName = this.file.uploded_file_name;
        this.fileDesc = this.file.uploaded_file_description;
        this.fileCategory = this.file.uploaded_file_category;
        this.fileOwner = this.dataService.userName;
        this.fileDate = this.file.uploaded_file_date;

        this.getFileSize(this.file.uploaded_file_size);

        this.displayFileContent();
        
        //this.readFIleContent(this.file);
    }

    displayFileContent = async () =>
    {
        const object = 
        {
            get_key: this.file.uploaded_file_storage_location
        };
        const rec_link = await fetch("http://127.0.0.1:4000/download",
        {
            method: 'POST',
            credentials: 'include',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });
        if(rec_link.status === 200)
        {
            const final_link = await rec_link.json();
            this.src = this.sanitizer.bypassSecurityTrustResourceUrl(final_link.resp) as SafeResourceUrl;
        }
        else if(rec_link.status === 404)
        {
            console.log("Error");
        }
    }

    // For detecting the file type and reading it accordingly
    readFIleContent(file: any)
    {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string; // Assuming fileContent is a base64-encoded string
            console.log(dataUrl);

            // Assuming this.sanitizer is from Angular's DomSanitizer
            this.src = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl) as SafeResourceUrl;

            console.log(this.src);
        };
        reader.readAsDataURL(file);

        this.uploadedFile = file;
    }

    getFileSize(fileSize: number)
    {
        this.fileSize = fileSize/ 100000;
    }

    downloadFile = async () => 
    {   
        const rec_link = await fetch("http://127.0.0.1:4000/download", 
        {
            method: 'POST',
            credentials: 'include',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({get_key: this.file.uploaded_file_storage_location})
        });
        
        if (rec_link.status === 200) 
        {
            const final_link = await rec_link.json();
            const downloadUrl = final_link.resp;
        
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
        
            // Create a temporary downloadable URL
            const downloadLink = URL.createObjectURL(blob);
        
            // Simulate click with download attribute and force download
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = downloadLink;
            downloadAnchor.download =  this.file.uploded_file_name;
            console.log(downloadAnchor.download);
            downloadAnchor.target = '_blank';
            downloadAnchor.setAttribute('download', ''); // Force download (apparently experimental, works tho)
        
            downloadAnchor.click();
        
            // Revoke the temporary URL after download
            setTimeout(() => URL.revokeObjectURL(downloadLink), 1000); // After a short delay
        } 
        else 
        {
            console.log("Error downloading file:", rec_link.status);
        }
    };
}
