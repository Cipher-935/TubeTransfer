import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { CommonModule } from '@angular/common';

// Optional: Define an interface for the data sent to the backend
interface DeleteObject 
{
  main_key: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent 
{
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
}
