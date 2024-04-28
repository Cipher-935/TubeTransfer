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
        const token = localStorage.getItem('auth-token');

        if (token)
        {
            fetch('http://localhost:4000/user/user_data',
                {
                    method: 'GET',
                    headers:
                    {
                        'Authorization': `Beared ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                .then(data =>
                {
                    if (data.success)
                    {
                        this.userName = data.name;
                        this.isLogin = true;
                    }
                    else
                    {
                        console.error('Failed to fetch user data: ', data.message)
                    }
                }).catch(error => console.error('Error fetching user data: ', error));
        }
    }

    logout()
    {
        localStorage.removeItem('auth-token');
        window.location.replace("/");
    }
}
