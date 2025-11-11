import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Clase, ClaseData, CursosClases } from '../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private readonly CLASES_KEY = 'cursos_clases';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getClasesFromStorage(): CursosClases {
    if (!this.isBrowser) {
      return {};
    }

    try {
      const data = localStorage.getItem(this.CLASES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error al cargar clases desde localStorage:', error);
      return {};
    }
  }

  private saveClasesToStorage(clases: CursosClases): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.CLASES_KEY, JSON.stringify(clases));
    } catch (error) {
      console.error('Error al guardar clases en localStorage:', error);
    }
  }

  getClasesByCurso(cursoId: number): Clase[] {
    const todasLasClases = this.getClasesFromStorage();
    return todasLasClases[cursoId] || [];
  }

  crearClase(claseData: ClaseData): { success: boolean; message: string; clase?: Clase } {
    try {
      const todasLasClases = this.getClasesFromStorage();
      
      if (!todasLasClases[claseData.cursoId]) {
        todasLasClases[claseData.cursoId] = [];
      }

      const clasesDelCurso = todasLasClases[claseData.cursoId];
      const nuevoOrden = clasesDelCurso.length + 1;

      const nuevaClase: Clase = {
        id: this.generarIdUnico(),
        nombre: claseData.nombre,
        descripcion: claseData.descripcion,
        recursos: claseData.recursos || '',
        cursoId: claseData.cursoId,
        fechaCreacion: new Date().toISOString(),
        orden: nuevoOrden
      };

      todasLasClases[claseData.cursoId].push(nuevaClase);
      this.saveClasesToStorage(todasLasClases);

      return {
        success: true,
        message: 'Clase creada exitosamente',
        clase: nuevaClase
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear la clase'
      };
    }
  }

  eliminarClase(cursoId: number, claseId: string): { success: boolean; message: string } {
    try {
      const todasLasClases = this.getClasesFromStorage();
      
      if (!todasLasClases[cursoId]) {
        return {
          success: false,
          message: 'Curso no encontrado'
        };
      }

      const index = todasLasClases[cursoId].findIndex(clase => clase.id === claseId);
      
      if (index === -1) {
        return {
          success: false,
          message: 'Clase no encontrada'
        };
      }

      todasLasClases[cursoId].splice(index, 1);
      
      todasLasClases[cursoId].forEach((clase, idx) => {
        clase.orden = idx + 1;
      });

      this.saveClasesToStorage(todasLasClases);

      return {
        success: true,
        message: 'Clase eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar la clase'
      };
    }
  }

  actualizarClase(cursoId: number, claseId: string, datos: Partial<ClaseData>): { success: boolean; message: string } {
    try {
      const todasLasClases = this.getClasesFromStorage();
      
      if (!todasLasClases[cursoId]) {
        return {
          success: false,
          message: 'Curso no encontrado'
        };
      }

      const clase = todasLasClases[cursoId].find(c => c.id === claseId);
      
      if (!clase) {
        return {
          success: false,
          message: 'Clase no encontrada'
        };
      }

      if (datos.nombre) clase.nombre = datos.nombre;
      if (datos.descripcion) clase.descripcion = datos.descripcion;
      if (datos.recursos !== undefined) clase.recursos = datos.recursos;

      this.saveClasesToStorage(todasLasClases);

      return {
        success: true,
        message: 'Clase actualizada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar la clase'
      };
    }
  }

  private generarIdUnico(): string {
    return `clase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getAllClases(): CursosClases {
    return this.getClasesFromStorage();
  }
}
