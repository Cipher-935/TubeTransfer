import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

// Optional: Define an interface for the data sent to the backend
interface DeleteObject 
{
  main_key: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [HttpClientModule, CommonModule, VideoPlayerComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent 
{
    //constructor(private fileReader:FileReader) {}

    @Input()src!: string;

    onFileSelected(event: any) 
    {
        const reader = new FileReader();
        const file = event.target.files[0];
      
        reader.onload = (e: any) => 
        {
          // Handle the loaded file content
          const videoUrl = e.target.result;
          this.src = videoUrl; 
        };

        // Read the file as a data URL (for testing)
        reader.readAsDataURL(file);

        console.log(file);
      }

    deleteFile = async (fileName: string) =>
    {
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

    getLink = async (fileName: string) =>
    {
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
            //vid_tag.setAttribute("src", final_link.resp);
        }
        else if(rec_link.status === 404)
        {
            //alert(final_link.resp);
        }
    }

    uploadFile = async (fileName: string) =>
    {
        
    }
}
