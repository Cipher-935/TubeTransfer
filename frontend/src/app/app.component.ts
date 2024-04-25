import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { CommunicationService } from './services/communication.service';

@Component(
{
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, HeaderComponent, HeroComponent, FileUploadComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent 
{
    readonly apiUrl="http://localhost:4000/test/";
    responseMessage: string = '';

    constructor(private httpClient:HttpClient, private communicationService: CommunicationService){}

    ngOnInit()
    {
        this.httpClient.get<any>(this.apiUrl).subscribe(response => 
        {
            console.log("Connect: " + response.message);
        });

        this.communicationService.scrollUploadComponent$.subscribe(() => 
        {
            this.scrollToUploadComponent();
        });
    }

    getTestMessage()
    {
        this.httpClient.get<any>(this.apiUrl).subscribe(response =>
        {
            this.responseMessage = response.message;
        });
    }

    scrollToUploadComponent() 
    {
        const uploadComponent = document.querySelector('app-file-upload');
        if (uploadComponent) 
        {
            uploadComponent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
