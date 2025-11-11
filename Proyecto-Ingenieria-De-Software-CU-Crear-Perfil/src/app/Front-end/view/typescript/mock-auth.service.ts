import { Injectable } from '@angular/core';

export type Usuario = {
  username: string;
  rol: 'Profesor' | 'Estudiante';
  curso: string;
};

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private usuarioActual: Usuario | null = null;

  login(username: string, password: string, rol: Usuario['rol'], curso: string): Usuario {
    this.usuarioActual = { username, rol, curso };
    sessionStorage.setItem('usuario', JSON.stringify(this.usuarioActual));
    return this.usuarioActual;
  }

  getUsuario(): Usuario | null {
    if (this.usuarioActual) return this.usuarioActual;
    const saved = sessionStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  }

  logout() {
    this.usuarioActual = null;
    sessionStorage.removeItem('usuario');
  }
}
