import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { tarea } from './tarea.model';

@Component({
  selector: 'app-consultar-tarea-est',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../html/consultar_tarea_est.html',
  styleUrls: ['../css/consultar_tarea_est.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultarTareaEst implements OnInit {
  tarea?: tarea;
  cursoNombre = '';
  backRoute = '/gestion_tareas_est';

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const state = window.history.state as any;
      if (state?.tarea) {
        this.tarea = new tarea(
          state.tarea.id,
          state.tarea.titulo,
          state.tarea.entrega,
          state.tarea.estado,
          state.tarea.descripcion,
          state.tarea.puntaje,
          state.tarea.curso
        );
        this.cursoNombre = this.tarea.curso || 'Curso sin nombre';
        this.backRoute = state?.back || '/gestion_tareas_est';
      }
    }
  }

  get estadoActual(): string {
    if (!this.tarea) return '-';
    const hoy = new Date();
    const fecha = new Date(this.tarea.entrega);
    return fecha < hoy ? 'Cerrada' : 'Activa';
  }
}
