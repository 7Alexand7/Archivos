import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthController } from '../../../Back-end/controllers/auth.controller';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: '../html/login.html',
  styleUrls: ['../css/login.css'],
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authController: AuthController,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    const result = await this.authController.login({
      username: this.username,
      password: this.password
    });

    if (result.success) {
      this.router.navigate(['/gestion-cursos']);
    } else {
      this.errorMessage = result.message;
    }
  }
}
