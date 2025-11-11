import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthController } from '../../../Back-end/controllers/auth.controller';

@Component({
  selector: 'app-crear-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../html/crear-perfil.html',
  styleUrls: ['../css/crear-perfil.css'],
})
export class CrearPerfil {
  profileForm: FormGroup;
  name: FormControl;
  lastname: FormControl;
  username: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  
  asignatures = [
    'Ingenieria-de-Software',
    'Metodos-Numericos',
    'Sistemas-de-Bases-de-Datos',
    'Topicos-Especiales-de-Programacion',
    'Calculo-Diferencial',
    'Calculo-Integral',
    'Calculo-Vectorial',
    'Ecuaciones-Diferenciales-Ordinarias',
    'Algebra-Lineal',
    'Campos-y-Ondas',
    'Probabilidad-y-Estadistica',
    'Logica',
    'Matematicas-Discretas',
  ];
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authController: AuthController,
    private router: Router
  ) {
    this.name = new FormControl('');
    this.lastname = new FormControl('');
    this.username = new FormControl('');
    this.password = new FormControl('');
    this.confirmPassword = new FormControl('');

    this.profileForm = new FormGroup({
      catalog: new FormControl([]),
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.profileForm.value;

    const result = await this.authController.register({
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      name: formData.name,
      lastname: formData.lastname,
      asignatures: formData.catalog
    });

    if (result.success) {
      this.successMessage = result.message;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = result.message;
    }
  }

  toggleAsignature(Asignature: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const catalog = this.profileForm.value.catalog;

    if (checked) {
      catalog.push(Asignature);
    } else {
      const index = catalog.indexOf(Asignature);
      if (index > -1) catalog.splice(index, 1);
    }

    this.profileForm.get('catalog')?.setValue(catalog);
  }

  formatSignature(asig: string): string {
    return asig.replace(/-/g, ' ');
  }
}
