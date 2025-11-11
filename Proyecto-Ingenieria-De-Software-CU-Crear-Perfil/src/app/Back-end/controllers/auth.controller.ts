import { Injectable } from '@angular/core';
import { LoginData, RegisterData, User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthController {
  
  constructor(private userService: UserService) {}

  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    if (!data.username || !data.password || !data.confirmPassword) {
      return { success: false, message: 'Todos los campos son requeridos' };
    }

    if (data.username.length < 10) {
      return { success: false, message: 'El usuario debe tener al menos 10 caracteres' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      return { success: false, message: 'El usuario solo puede contener letras, números y guión bajo' };
    }

    if (data.password.length !== 8) {
      return { success: false, message: 'La contraseña debe tener exactamente 8 caracteres' };
    }

    if (!/[A-Z]/.test(data.password)) {
      return { success: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
    }

    if (!/[a-z]/.test(data.password)) {
      return { success: false, message: 'La contraseña debe contener al menos una letra minúscula' };
    }

    if (!/[0-9]/.test(data.password)) {
      return { success: false, message: 'La contraseña debe contener al menos un número' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Las contraseñas no coinciden' };
    }

    if (await this.userService.userExists(data.username)) {
      return { success: false, message: 'El usuario ya existe' };
    }

    // Validar campos de perfil opcionales/ requeridos
    if (!data.name || !data.lastname) {
      return { success: false, message: 'Nombre y apellido son requeridos' };
    }

    // Crear usuario entregando también los datos de perfil
    const user = await this.userService.createUser(
      data.username,
      data.password,
      data.name,
      data.lastname,
      data.asignatures || []
    );
    return { 
      success: true, 
      message: 'Usuario registrado exitosamente',
      user 
    };
  }

  async login(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    if (!data.username || !data.password) {
      return { success: false, message: 'Usuario y contraseña son requeridos' };
    }

    const user = await this.userService.getUserByUsername(data.username);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (user.password !== data.password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    return { 
      success: true, 
      message: 'Inicio de sesión exitoso',
      user 
    };
  }
}
