import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ClaseController } from '../../../Back-end/controllers/clase.controller';
import { Clase } from '../../../Back-end/models/clase.model';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
  periodo: string;
  agregado: boolean;
  esDelSistema: boolean;
  creadoPor?: string;
  fechaCreacion?: string;
}

interface Usuario {
  tipo: 'estudiante' | 'profesor';
  cursosAgregados: number[];
  nombre?: string;
}

@Component({
  selector: 'app-gestion-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: '../html/gestion-cursos.html',
  styleUrls: ['../css/gestion-cursos.css']
})
export class GestionCursos implements OnInit {
  usuario: Usuario = {
    tipo: 'profesor',
    cursosAgregados: [],
    nombre: ''
  };

  cursosPredefinidos: Curso[] = [
    {
      id: 1,
      nombre: 'Ingeniería de Software',
      codigo: '202615-16015',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2025-01-01'
    },
    {
      id: 2,
      nombre: 'Base de Datos',
      codigo: '202615-16016',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2025-01-01'
    },
    {
      id: 3,
      nombre: 'Programación Avanzada',
      codigo: '202615-16017',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2025-01-01'
    },
    {
      id: 4,
      nombre: 'Estructuras de Datos',
      codigo: '202615-16018',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2025-01-01'
    }
  ];
  cursosProfesor: Curso[] = [];

  nuevoCurso: Partial<Curso> = {
    nombre: '',
    codigo: '',
    periodo: '202615 Sem Sep/Ene 25-26 PR'
  };

  mostrarModalAgregarCurso = false;
  mostrarModalCrearCurso = false;
  cursoSeleccionado: Curso | null = null;
  clasesDelCurso: Clase[] = [];
  vistaClases = false;

  private readonly CURSOS_KEY = 'cursos_profesor';
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private claseController: ClaseController,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
  if (this.isBrowser) {
    const savedUser = sessionStorage.getItem('usuario');
    if (savedUser) {
      const data = JSON.parse(savedUser);
      this.usuario.tipo =
        data.rol?.toLowerCase() === 'profesor' ? 'profesor' : 'estudiante';
      this.usuario.nombre = `${data.name || data.username || ''} ${data.lastname || ''}`.trim();
    }
  }

  this.cargarCursosProfesor();
  this.actualizarEstadoCursos();

  this.route.queryParams.subscribe(params => {
    const cursoId = params['cursoId'];
    if (cursoId) {
      this.verClasesCurso(parseInt(cursoId));
    }
  });
}


// ==============================
// ===== TAREAS =================
// ==============================

  verTareasCurso(curso: Curso): void {
    const datosUsuario = sessionStorage.getItem('usuario');
    let usuarioData: any = null;

    if (datosUsuario) {
      usuarioData = JSON.parse(datosUsuario);
    }

    const dataEnviar = {
      cursoNombre: curso.nombre,
      cursoCodigo: curso.codigo,
      usuario: usuarioData
    };

    // Redirigir según el rol detectado
    if (this.usuario.tipo === 'profesor') {
      this.router.navigate(['/gestion_tareas'], { queryParams: dataEnviar });
    } else {
      this.router.navigate(['/gestion_tareas_est'], { queryParams: dataEnviar });
    }
  }

  verQuizzesCurso(curso: Curso): void {
    const datosUsuario = sessionStorage.getItem('usuario');
    let usuarioData: any = null;

    if (datosUsuario) {
      usuarioData = JSON.parse(datosUsuario);
    }

    const dataEnviar = {
      cursoNombre: curso.nombre,
      cursoCodigo: curso.codigo,
      usuario: usuarioData
    };

    // Redirigir según el rol detectado
    if (this.usuario.tipo === 'profesor') {
      this.router.navigate(['/gestion-quizzes-profesor'], { queryParams: dataEnviar });
    } else {
      this.router.navigate(['/gestion-quizzes-estudiante'], { queryParams: dataEnviar });
    }
  }



  // ==============================
  // ===== CURSOS =================
  // ==============================

  private cargarCursosProfesor(): void {
    if (!this.isBrowser) return;

    try {
      const cursosGuardados = localStorage.getItem(this.CURSOS_KEY);
      if (cursosGuardados) {
        this.cursosProfesor = JSON.parse(cursosGuardados);
      }
    } catch (error) {
      console.error('Error al cargar cursos desde localStorage:', error);
      this.cursosProfesor = [];
    }
  }

  private guardarCursosProfesor(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.CURSOS_KEY, JSON.stringify(this.cursosProfesor));
    } catch (error) {
      console.error('Error al guardar cursos en localStorage:', error);
    }
  }

  private actualizarEstadoCursos(): void {
    this.cursosPredefinidos.forEach(curso => {
      curso.agregado = this.usuario.cursosAgregados.includes(curso.id);
    });
    this.cursosProfesor.forEach(curso => {
      curso.agregado = this.usuario.cursosAgregados.includes(curso.id);
    });
  }

  get cursosVisibles(): Curso[] {
    if (this.usuario.tipo === 'profesor') {
      return [...this.cursosPredefinidos, ...this.cursosProfesor];
    } else {
      return [...this.cursosPredefinidos, ...this.cursosProfesor.filter(curso => curso.esDelSistema)];
    }
  }

  get puedeAgregarCursos(): boolean {
    if (this.usuario.tipo === 'estudiante') {
      return this.cursosAgregadosCount < 4;
    }
    return this.cursosPredefinidos.length + this.cursosProfesor.length < 15;
  }

  get cursosAgregadosCount(): number {
    const cursosSistema = this.cursosPredefinidos.filter(curso => curso.agregado).length;
    const cursosProfesor = this.cursosProfesor.filter(curso => curso.agregado).length;
    return cursosSistema + cursosProfesor;
  }

  agregarCursoSistema(): void {
    if (this.cursosPredefinidos.length + this.cursosProfesor.length >= 15) {
      alert('No se pueden agregar más cursos. Límite máximo: 15 cursos.');
      return;
    }

    if (this.nuevoCurso.nombre && this.nuevoCurso.codigo) {
      const nuevoCurso: Curso = {
        id: this.generarIdUnico(),
        nombre: this.nuevoCurso.nombre!,
        codigo: this.nuevoCurso.codigo!,
        periodo: this.nuevoCurso.periodo!,
        agregado: false,
        esDelSistema: true,
        creadoPor: this.usuario.nombre || 'Profesor',
        fechaCreacion: new Date().toISOString().split('T')[0]
      };

      this.cursosProfesor.push(nuevoCurso);
      this.guardarCursosProfesor();
      this.limpiarFormulario();
      this.mostrarModalCrearCurso = false;
      alert('Curso agregado exitosamente.');
    } else {
      alert('Por favor complete todos los campos obligatorios.');
    }
  }

  agregarCursoEstudiante(cursoId: number): void {
    if (this.cursosAgregadosCount >= 4) {
      alert('No puedes agregar más de 4 cursos a tu cuenta.');
      return;
    }

    if (!this.usuario.cursosAgregados.includes(cursoId)) {
      this.usuario.cursosAgregados.push(cursoId);
      this.actualizarEstadoCursos();
      alert('Curso agregado a tu cuenta exitosamente.');
    }
  }

  quitarCursoEstudiante(cursoId: number): void {
    const index = this.usuario.cursosAgregados.indexOf(cursoId);
    if (index > -1) {
      this.usuario.cursosAgregados.splice(index, 1);
      this.actualizarEstadoCursos();
      alert('Curso removido de tu cuenta.');
    }
  }

  private generarIdUnico(): number {
    const ids = [
      ...this.cursosPredefinidos.map(curso => curso.id),
      ...this.cursosProfesor.map(curso => curso.id)
    ];
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private limpiarFormulario(): void {
    this.nuevoCurso = {
      nombre: '',
      codigo: '',
      periodo: '202615 Sem Sep/Ene 25-26 PR'
    };
  }

  estaAgregado(cursoId: number): boolean {
    return this.usuario.cursosAgregados.includes(cursoId);
  }

  toggleCurso(cursoId: number): void {
    if (this.estaAgregado(cursoId)) {
      this.quitarCursoEstudiante(cursoId);
    } else {
      this.agregarCursoEstudiante(cursoId);
    }
  }

  eliminarCursoProfesor(cursoId: number): void {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      this.cursosProfesor = this.cursosProfesor.filter(curso => curso.id !== cursoId);
      this.guardarCursosProfesor();
      this.actualizarEstadoCursos();
      alert('Curso eliminado exitosamente.');
    }
  }

  // ==============================
  // ===== CLASES =================
  // ==============================

  verClasesCurso(cursoId: number): void {
    const curso = this.cursosVisibles.find(c => c.id === cursoId);
    if (curso) {
      this.cursoSeleccionado = curso;
      this.clasesDelCurso = this.claseController.obtenerClasesPorCurso(cursoId);
      this.vistaClases = true;
    }
  }

  volverACursos(): void {
    this.vistaClases = false;
    this.cursoSeleccionado = null;
    this.clasesDelCurso = [];
    this.router.navigate(['/gestion-cursos']);
  }

  crearNuevaClase(): void {
    if (this.cursoSeleccionado) {
      this.router.navigate(['/crear-clase'], {
        queryParams: {
          cursoId: this.cursoSeleccionado.id,
          cursoNombre: this.cursoSeleccionado.nombre
        }
      });
    }
  }

  eliminarClase(claseId: string): void {
    if (this.cursoSeleccionado && confirm('¿Deseas eliminar esta clase?')) {
      const result = this.claseController.eliminarClase(this.cursoSeleccionado.id, claseId);
      if (result.success) {
        this.clasesDelCurso = this.claseController.obtenerClasesPorCurso(this.cursoSeleccionado.id);
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  }

  get clasesPlaceholder(): any[] {
    return this.clasesDelCurso.length === 0 ? Array(6).fill(null) : [];
  }

  // ==============================
  // ===== SESIÓN =================
  // ==============================

  salir(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
