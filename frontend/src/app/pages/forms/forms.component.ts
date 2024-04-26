import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent 
{   
    constructor(private httpClient:HttpClient, private communicationService: CommunicationService){}

    readonly apiUrl="http://localhost:4000/delete";

    deleteFile() 
    {
        this.httpClient.get<any>(this.apiUrl).subscribe(response => 
        {
            console.log("Connect: " + response.resp);
        });
    }
    
}
