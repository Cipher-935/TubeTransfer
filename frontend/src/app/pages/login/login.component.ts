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
        }
        // else
        // {
        //     if (this.isOTPView)
        //         return;

        //     this.formHolder = form;
        //     this.goToOTP(this.formHolder.value.email);
        // }
    }

    goToOTP(localEmail: string)
    {
        if (localEmail) 
        {
            this.OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(this.OTP);
            console.log(localEmail);

            fetch('http://localhost:4000/user/send_recovery_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipient_email: localEmail, OTP: this.OTP }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.success) {
                    alert("OTP Sent");
                    this.isOTPView = true;
                } else {
                    alert("Error occurred while sending OTP");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("An error occurred while sending OTP");
            });
            return;
        }
        return alert("Please enter your email");
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

        await fetch('http://localhost:4000/user/signup',
        {
            method: 'POST',
            headers:
            {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formHolder.value),
        }).then((response) => response.json())
        .then((data) => 
        {
            if (data.success)
            {
                this.isOTPView = false;
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
