import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent 
{
    isLogin: boolean = false;
    userName: string = "";

    ngOnInit()
    {
        //console.log(document.cookie);
        this.getUserData();
    }

    getUserData = async () =>
    {
        const rec_dat = await fetch("http://127.0.0.1:4000/list",
        {
            method: 'GET',
            credentials: 'include'
        });

        if(rec_dat.status === 200){
            const final_data = await rec_dat.json();
            console.log(final_data.all_files);
            console.log(final_data.f_name);
        }
        else
        {
            const s = await rec_dat.json();
            alert(s.resp);
        }
    }
    
    logout()
    {
        localStorage.removeItem('auth-token');
        window.location.replace("/");
    }
}
