import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { CommunicationService } from './services/communication.service';
import { FooterComponent } from './components/footer/footer.component';

@Component(
{
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, HeaderComponent, HeroComponent, FileUploadComponent,
        FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent 
{
    title:string = 'frontend';
    responseMessage: string = '';

    constructor(private httpClient:HttpClient, private communicationService: CommunicationService){}

    ngOnInit()
    {
        this.communicationService.scrollUploadComponent$.subscribe(() => 
        {
            this.scrollToUploadComponent();
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
