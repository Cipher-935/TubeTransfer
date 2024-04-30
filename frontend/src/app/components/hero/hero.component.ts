import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent 
{
    constructor(private communicationService: CommunicationService) { }
}
