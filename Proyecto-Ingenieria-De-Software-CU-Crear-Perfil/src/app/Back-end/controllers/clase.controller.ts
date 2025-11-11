import { Injectable } from '@angular/core';
import { ClaseService } from '../services/clase.service';
import { ClaseData, Clase } from '../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class ClaseController {
  constructor(private claseService: ClaseService) {}

  async crearClase(claseData: ClaseData): Promise<{ success: boolean; message: string; clase?: Clase }> {
    if (!claseData.nombre || claseData.nombre.trim() === '') {
      return {
        success: false,
        message: 'El nombre de la clase es obligatorio'
      };
    }

    if (!claseData.descripcion || claseData.descripcion.trim() === '') {
      return {
        success: false,
        message: 'La descripción de la clase es obligatoria'
      };
    }

    if (!claseData.cursoId) {
      return {
        success: false,
        message: 'Debe especificar el curso'
      };
    }

    return this.claseService.crearClase(claseData);
  }

  obtenerClasesPorCurso(cursoId: number): Clase[] {
    return this.claseService.getClasesByCurso(cursoId);
  }

  eliminarClase(cursoId: number, claseId: string): { success: boolean; message: string } {
    return this.claseService.eliminarClase(cursoId, claseId);
  }

  actualizarClase(cursoId: number, claseId: string, datos: Partial<ClaseData>): { success: boolean; message: string } {
    return this.claseService.actualizarClase(cursoId, claseId, datos);
  }
}
