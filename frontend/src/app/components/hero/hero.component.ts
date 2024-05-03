import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
    constructor(private router: Router) { }

    navigateToUpload() 
    {
        this.router.navigate(['/menu'], { queryParams: { component: 'upload' } });
    }
}
