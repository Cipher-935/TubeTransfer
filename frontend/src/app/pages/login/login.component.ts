import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private router: Router) {}

    isLogin: boolean = true;
    isOTPView: boolean = false;

    formHolder!: NgForm;

    OTP: number = 0;

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
            const send_reg = await fetch('http://127.0.0.1:4000/login',
            {
                method: 'POST',
                credentials: 'include',
                headers:
                {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.value),
            });

            const r_dat = await send_reg.json();
            alert(r_dat.resp);

            this.router.navigate(['/menu']);
        }
        else
        {
            if (this.isOTPView)
                return;

            this.formHolder = form;
            this.goToOTP(this.formHolder.value.email);
        }
    }

    goToOTP = async (localEmail: string) =>
    {
        if (localEmail) 
        {
            this.OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(this.OTP);
            console.log(localEmail);

            const recieved_response = await fetch('http://127.0.0.1:4000/send_recovery_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipient_email: localEmail, OTP: this.OTP }),
            });

            if (recieved_response.status === 200)
            {
                alert("OTP Sent");
                this.isOTPView = true;
            }
            else
            {
                alert("An error occurred while sending OTP");
            }
        }
    }

    verifyOTP(otpInputString: string)
    {
        const otpInput = parseInt(otpInputString)

        if (this.OTP === otpInput)
        {
            this.signUp();
            return;
        }
        alert("Code is incorrect, try again");
        return;
    }

    signUp = async () => 
    {
        console.log("Signing up: ", this.formHolder.value);

        const recieved_response = await fetch('http://127.0.0.1:4000/signup',
        {
            method: 'POST',
            credentials: 'include',
            headers:
            {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formHolder.value),
        });

        if (recieved_response.status === 200)
        {
            this.isOTPView = false;
            this.isLogin = !this.isLogin;
        }
        else
        {
            const data = await recieved_response.json();

            console.log(data.resp);
        }
    }
}
