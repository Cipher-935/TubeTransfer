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

            this.isLogin = true;
            this.userName = final_data.f_name;
        }
        else
        {
            this.isLogin = false;
        }
    }
    
    logout = async () =>
    {
        const rec_dat = await fetch("http://127.0.0.1:4000/logout",
        {
            method: 'GET',
            credentials: 'include'
        });

        if(rec_dat.status === 200)
        {

            window.location.replace("/");
        }
        else
        {
            console.log(rec_dat);
        }
    }
}
