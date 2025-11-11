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

    // 🔹 Verificar que el resultado sea exitoso y tenga usuario
    if (result.success && result.user) {
      // Detectar si es el usuario profesor
      const rolDetectado =
        result.user.username === 'carlosGonzalez' ? 'Profesor' : 'Estudiante';

      // Crear el objeto con el rol incluido
      const usuario = {
        ...result.user,
        rol: rolDetectado
      };

      // Guardar usuario con rol en sessionStorage
      sessionStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir a Gestión de Cursos
      this.router.navigate(['/gestion-cursos']);
    } else {
      this.errorMessage = result.message || 'Error de autenticación.';
    }
  }
}
