// src/app/Front-end/view/typescript/gestion_tareas_est.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { tarea } from './tarea.model';
import { taskService } from './taskService';

@Component({
  selector: 'app-gestion-tareas-est',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../html/gestion_tareas_est.html',
  styleUrls: ['../css/gestion_tareas_est.css'],
})
export class GestionTareasEst implements OnInit {
  cursoNombre = '';
  usuario: any = null;
  tareas: tarea[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskSrv: taskService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.recibirDatos();
    this.cargarTareas();
  }

  // ===============================
  // 📦 Recibir curso y usuario
  // ===============================
  private recibirDatos() {
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

    // 🔹 Si no llegan por queryParams, buscar en sessionStorage
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

    console.log('✅ Datos recibidos en GestionTareasEst:');
    console.log('Curso:', this.cursoNombre);
    console.log('Usuario:', this.usuario);
  }

  // ===============================
  // 🧱 Cargar tareas del curso actual
  // ===============================
  private cargarTareas() {
    if (isPlatformBrowser(this.platformId)) {
      this.tareas = this.taskSrv.getAll().filter(t => t.curso === this.cursoNombre);

      // Si no hay tareas, cargar ejemplos
      if (this.tareas.length === 0) {
        const ejemplo = [
          new tarea(1, 'Lectura: Componentes y Módulos', '2025-11-18', 'Pendiente', '', null, this.cursoNombre),
          new tarea(2, 'Cuestionario Angular CLI', '2025-11-19', 'En progreso', '', null, this.cursoNombre),
          new tarea(3, 'Práctica: Formularios Reactivos', '2025-11-22', 'Completada', '', null, this.cursoNombre),
        ];
        ejemplo.forEach(t => this.taskSrv.add(t));
        this.tareas = this.taskSrv.getAll().filter(t => t.curso === this.cursoNombre);
      }
    }
  }

  // ===============================
  // 🔍 Ver detalle de tarea
  // ===============================
  verDetalle(t: tarea) {
    // Guardar curso y usuario antes de navegar
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('cursoNombre', this.cursoNombre);
      if (this.usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      }
    }

    this.router.navigate(['/consultar_tarea_est', t.id], {
      state: { tarea: t, back: '/gestion_tareas_est' }
    });
  }

  trackById(_: number, t: tarea) {
    return t.id;
  }
}
