import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/gestion-cursos.html',
  styleUrls: ['../css/gestion-cursos.css']
})
export class GestionCursos implements OnInit {
  usuario: Usuario = {
    tipo: 'profesor',
    cursosAgregados: [1, 2],
    nombre: 'Dr. Carlos López'
  };

  cursosPredefinidos: Curso[] = [
    {
      id: 1,
      nombre: 'Ingeniería de Software',
      codigo: '202615-16014',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: true,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2024-01-01'
    },
    {
      id: 2,
      nombre: 'Métodos Numéricos',
      codigo: '202615-15702',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: true,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2024-01-01'
    },
    {
      id: 3,
      nombre: 'Sistemas de Bases de Datos',
      codigo: '202615-16854',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2024-01-01'
    },
    {
      id: 4,
      nombre: 'Tópicos Especiales de Programación...',
      codigo: '202615-15997',
      periodo: '202615 Sem Sep/Ene 25-26 PR',
      agregado: false,
      esDelSistema: true,
      creadoPor: 'Sistema',
      fechaCreacion: '2024-01-01'
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
  vistaClases: boolean = false;

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
    this.cargarCursosProfesor();
    this.actualizarEstadoCursos();
    
    this.route.queryParams.subscribe(params => {
      const cursoId = params['cursoId'];
      if (cursoId) {
        this.verClasesCurso(parseInt(cursoId));
      }
    });
  }

  private cargarCursosProfesor(): void {
    if (!this.isBrowser) {
      return;
    }

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
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.CURSOS_KEY, JSON.stringify(this.cursosProfesor));
    } catch (error) {
      console.error('Error al guardar cursos en localStorage:', error);
    }
  }

  salir(): void {
    this.router.navigate(['/login']);
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
    const cursosAgregadosSistema = this.cursosPredefinidos.filter(curso => curso.agregado).length;
    const cursosAgregadosProfesor = this.cursosProfesor.filter(curso => curso.agregado).length;
    return cursosAgregadosSistema + cursosAgregadosProfesor;
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
      alert('Curso agregado al sistema exitosamente.');
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
    const idsSistema = this.cursosPredefinidos.map(curso => curso.id);
    const idsProfesor = this.cursosProfesor.map(curso => curso.id);
    const idsExistentes = [...idsSistema, ...idsProfesor];
    return Math.max(...idsExistentes, 0) + 1;
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
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      const index = this.cursosProfesor.findIndex(curso => curso.id === cursoId);
      if (index > -1) {
        this.cursosProfesor.splice(index, 1);
        this.guardarCursosProfesor();
        this.actualizarEstadoCursos();
        alert('Curso eliminado exitosamente.');
      }
    }
  }

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
    if (this.cursoSeleccionado && confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
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
    if (this.clasesDelCurso.length === 0) {
      return Array(6).fill(null);
    }
    return [];
  }
}
