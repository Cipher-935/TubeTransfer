import { Routes } from '@angular/router';
import { FormsComponent } from './pages/forms/forms.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = 
[
    {path: '', component: HomeComponent},
    {path: 'forms', component: FormsComponent},
];
