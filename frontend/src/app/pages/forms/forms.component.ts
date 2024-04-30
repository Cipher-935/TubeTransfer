import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { File } from 'buffer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Optional: Define an interface for the data sent to the backend
interface DeleteObject 
{
  main_key: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [HttpClientModule, CommonModule, VideoPlayerComponent, FileUploadComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent 
{
    constructor(private sanitizer: DomSanitizer) {}

    isDraggingOver: boolean = false;
    fileIsSubmitted: boolean = false;

    fileName: string = "";
    //fileContent: string = "";
    
    @Input()src!: SafeResourceUrl;

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

    onDropFile(event: DragEvent)
    {
        event.preventDefault();
        event.stopPropagation();

        this.isDraggingOver = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0)
        {
            console.log("Files dropped: ", files[0]);
            this.fileName = files[0].name.substring(0, files[0].name.lastIndexOf("."));
            
            // Read file content
            this.ReadFIleContent(files[0]);
        }
    }

    // For detecting the file type and reading it accordingly
    ReadFIleContent(file: any)
    {
        const extension = file.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();

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
                
                break;
            }
        }
    }


    onFileSelected = async (event: any, fileDesc:string) =>
    {
        event.preventDefault();
        const file = event.target.files[0];

        const mfile = {file_name: file.name, file_mime: file.type, file_description: fileDesc, file_type: "nomral"};
         const rec_put_link = await fetch("http://127.0.0.1:4000/get-put-url",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(mfile)
         });
         if(rec_put_link.status === 200){
            const final_url = await rec_put_link.json();
            const put_req = await fetch(final_url.resp, {
                method: "PUT",
                headers: 
                {
                    "Content-Type": file.type
                },
                body: file
            });
            
            if(put_req.status === 200)
                {
                alert("Hey the file was uploaded");
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

    deleteFile = async (event: any, fileName: string) =>
    {
        event.preventDefault();
        console.log(fileName);

        // Construct the DeleteObject instance
        const deleteData: DeleteObject = 
        {
            main_key: fileName
        };

        const rec_list = await fetch("http://127.0.0.1:4000/delete", 
        {
            method: "POST",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(deleteData)
        });
        if(rec_list.status === 200)
        {
            const d_list = await rec_list.json();
            alert(d_list.resp);
        }
        else
        {
            alert("Did not receive anything");
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

    getLink = async (event:any, fileName: string) =>
    {
        event.preventDefault();

        const s_dat = {get_key: fileName};
        const rec_link = await fetch("http://127.0.0.1:4000/get-presign-link", 
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(s_dat)
        });
        if(rec_link.status === 200)
        {
            const final_link = await rec_link.json();
            console.log(final_link);
        }
        else if(rec_link.status === 404)
        {
            console.log("Error");
        }
    }

    uploadFile = async (event: any, fileDesc:string) =>
    {
        
    }
}
