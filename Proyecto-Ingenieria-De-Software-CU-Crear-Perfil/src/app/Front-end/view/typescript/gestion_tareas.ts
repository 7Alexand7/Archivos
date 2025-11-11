import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { taskService } from './taskService';
import { tarea } from './tarea.model';

@Component({
  selector: 'app-gestion-tareas',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: '../html/gestion_tareas.html',
  styleUrls: ['../css/gestion_tareas.css'],
})
export class GestionTareas implements OnInit {
  cursoNombre = '';
  usuario: any = null; // Aquí guardaremos los datos del usuario (rol, nombre, etc.)
  showForm = false;
  form!: FormGroup;
  tareas: tarea[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskSrv: taskService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.recibirDatos();
    this.cargarTareas();
  }

  // ===============================
  // 📦 Recibir datos del curso y usuario
  // ===============================
  private recibirDatos() {
    // 🔹 Obtener parámetros desde GestionCursos
    this.route.queryParams.subscribe(params => {
      if (params['cursoNombre']) {
        this.cursoNombre = params['cursoNombre'];
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('cursoNombre', this.cursoNombre);
        }
      }

      if (params['usuario']) {
        try {
          this.usuario = JSON.parse(params['usuario']);
        } catch {
          this.usuario = params['usuario'];
        }

        if (isPlatformBrowser(this.platformId) && this.usuario) {
          sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
        }
      }
    });

    // 🔹 Recuperar datos desde sessionStorage si no vinieron por queryParams
    if (isPlatformBrowser(this.platformId)) {
      const userSS = sessionStorage.getItem('usuario');
      if (userSS && !this.usuario) {
        this.usuario = JSON.parse(userSS);
      }

      const cursoSS = sessionStorage.getItem('cursoNombre');
      if (cursoSS && !this.cursoNombre) {
        this.cursoNombre = cursoSS;
      }
    }

    if (!this.cursoNombre) {
      this.cursoNombre = 'Curso sin nombre';
    }

    console.log('✅ Datos recibidos en GestionTareas:');
    console.log('Curso:', this.cursoNombre);
    console.log('Usuario:', this.usuario);
  }

  // ===============================
  // 🧱 Formularios y tareas
  // ===============================
  private inicializarFormulario() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      entrega: ['', [Validators.required, this.validarFecha.bind(this)]],
      descripcion: [''],
    });
  }

  // 📅 Validar fecha correctamente
  private validarFecha(control: any) {
    const valor = control.value;
    if (!valor) return null;

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(valor)) {
      return { formatoInvalido: true };
    }

    const [anio, mes, dia] = valor.split('-').map(Number);
    if (anio < 1900 || anio > 9999) return { anioInvalido: true };
    if (mes < 1 || mes > 12) return { mesInvalido: true };

    const diasPorMes = [31, (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (dia < 1 || dia > diasPorMes[mes - 1]) return { diaInvalido: true };

    const hoy = new Date();
    const fechaIngresada = new Date(valor);
    hoy.setHours(0, 0, 0, 0);

    if (fechaIngresada < hoy) return { fechaPasada: true };

    return null;
  }

  private cargarTareas() {
    if (isPlatformBrowser(this.platformId)) {
      this.tareas = this.taskSrv.getAll().filter(t => t.curso === this.cursoNombre);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) this.form.reset();
  }

  cancel() {
    this.form.reset();
    this.showForm = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const nueva = this.taskSrv.add({
      titulo: v.titulo,
      entrega: v.entrega,
      estado: 'Activa',
      descripcion: v.descripcion ?? '',
      puntaje: null,
      curso: this.cursoNombre,
    });

    this.tareas.push(nueva);
    this.cancel();
  }

  eliminar(t: tarea) {
    this.taskSrv.remove(t.id);
    this.tareas = this.tareas.filter(x => x.id !== t.id);
  }

  trackById(_: number, t: tarea) {
    return t.id;
  }

  verDetalle(t: tarea) {
    // 🔹 Guardar curso y usuario antes de ir al detalle
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('cursoNombre', this.cursoNombre);
      if (this.usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      }
    }

    this.router.navigate(['/consultar_tarea', t.id], { state: { tarea: t } });
  }
}
