import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaseController } from '../../../Back-end/controllers/clase.controller';

@Component({
  selector: 'app-crear-clase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../html/crear-clase.html',
  styleUrls: ['../css/crear-clase.css'],
})
export class CrearClase implements OnInit {
  claseForm: FormGroup;
  cursoId: number = 0;
  cursoNombre: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private claseController: ClaseController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.claseForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      recursos: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cursoId = params['cursoId'] ? parseInt(params['cursoId']) : 0;
      this.cursoNombre = params['cursoNombre'] || '';
      
      if (!this.cursoId) {
        this.router.navigate(['/gestion-cursos']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.claseForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios';
      return;
    }

    const formData = this.claseForm.value;

    const result = await this.claseController.crearClase({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      recursos: formData.recursos,
      cursoId: this.cursoId
    });

    if (result.success) {
      this.successMessage = result.message;
      setTimeout(() => {
        this.router.navigate(['/gestion-cursos'], {
          queryParams: { cursoId: this.cursoId }
        });
      }, 1500);
    } else {
      this.errorMessage = result.message;
    }
  }

  cancelar(): void {
    this.router.navigate(['/gestion-cursos'], {
      queryParams: { cursoId: this.cursoId }
    });
  }
}
