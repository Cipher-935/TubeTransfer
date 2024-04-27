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

    toggleForm() {
      this.isLogin = !this.isLogin;
    }
  
    onSubmit(form: NgForm) {
      // Handle form submission logic
    }
}
