import { Routes } from '@angular/router';
import { FormsComponent } from './pages/forms/forms.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { FileViewerComponent } from './pages/file-viewer/file-viewer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './pages/menu/menu.component';

export const routes: Routes = 
[
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'file-viewer', component: FileViewerComponent},
    {path: 'menu', component: MenuComponent}
];
