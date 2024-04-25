import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent 
{
    constructor(private communicationService: CommunicationService) { }

    scrollToUploadComponent() 
    {
      this.communicationService.triggerScrollUploadComponent();
    }
}
