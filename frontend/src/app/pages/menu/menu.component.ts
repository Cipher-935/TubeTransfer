import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsComponent } from '../forms/forms.component';
import { MessageBoxComponent } from '../../components/message-box/message-box.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SideBarComponent, 
    DashboardComponent, FormsComponent, MessageBoxComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent 
{
    selectedComponent: string = "";

    constructor(private route: ActivatedRoute) 
    {
        this.route.queryParams.subscribe(params => 
        {
          this.selectedComponent = params['component'] || 'dashboard';
        });
    }
}
