import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
    isCollapsed: boolean = true;
    isArrowFlipped: boolean = false;

    constructor(private router: Router) { }
  
    toggleSidebar(): void 
    {
        this.isCollapsed = !this.isCollapsed;
        this.isArrowFlipped = !this.isArrowFlipped;
    }

    navigateToDashboard() 
    {
        this.navigateTo('dashboard');
    }

    navigateToUpload() 
    {
        this.navigateTo('upload');
    }

    navigateTo(componentToGoTo: string)
    {
        this.router.navigate(['/menu'], { queryParams: { component: componentToGoTo } });
        this.isCollapsed = !this.isCollapsed;
        this.isArrowFlipped = !this.isArrowFlipped;
    }

    @HostListener('document:click', ['$event']) // For listening for click events
    collapseSidebar(event: MouseEvent): void 
    {
        const target = event.target as HTMLElement;
        const sidebar = document.querySelector('.sidebar') as HTMLElement;
  
        if (!sidebar.contains(target) && !target.classList.contains('sidebar-toggle')) 
        {
            this.isCollapsed = true;
            this.isArrowFlipped = false;
        }
    }

    @HostListener('window:scroll', ['$event']) // For listening for the scroll event
    onWindowScroll(event: Event) 
    {
        // Collapse the sidebar
        this.isCollapsed = true;
        this.isArrowFlipped = false;
    }
}
