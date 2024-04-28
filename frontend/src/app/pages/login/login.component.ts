import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    isLogin: boolean = true;

    toggleForm() 
    {
        this.isLogin = !this.isLogin;
    }
  
    onSubmit = async (form: NgForm) =>
    {
        if (this.isLogin)
        {
            console.log("Login: ", form.value);

            console.log("JSON: ", JSON.stringify(form.value));
            await fetch('http://localhost:4000/user/login',
            {
                method: 'POST',
                headers:
                {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.value),
            }).then((response) => response.json())
            .then((data) => 
            {
                if (data.success)
                {
                    localStorage.setItem('auth-token', data.token);

                    window.location.replace("/");
                }
                else
                {
                    alert("Error occured while logging in");
                }
            });
        }
        else
        {
            console.log("Signing up: ", form.value);

            await fetch('http://localhost:4000/user/signup',
            {
                method: 'POST',
                headers:
                {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.value),
            }).then((response) => response.json())
            .then((data) => 
            {
                if (data.success)
                {
                    this.isLogin = !this.isLogin;
                    alert("Account created!");
                }
                else
                {
                    alert("Error occured while creating account");
                }
            });
        }
    }
}
