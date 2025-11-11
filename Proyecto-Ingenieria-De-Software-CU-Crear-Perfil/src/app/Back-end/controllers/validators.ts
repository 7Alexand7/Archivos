// src/app/Back-end/utils/validators.ts
export function validateUsername(username: string): { valid: boolean; message?: string } {
  if (!username) return { valid: false, message: 'Usuario requerido' };
  if (username.length < 10) return { valid: false, message: 'El usuario debe tener al menos 10 caracteres' };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { valid: false, message: 'Solo letras, números y guión bajo' };
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: 'Contraseña requerida' };
  if (password.length < 8) return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' }; // sugiero mínimo
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Debe contener al menos una mayúscula' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Debe contener al menos una minúscula' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Debe contener al menos un número' };
  return { valid: true };
}

export function validateRegisterData(data: { username?: string; password?: string; confirmPassword?: string; }) {
  const u = validateUsername(data.username || '');
  if (!u.valid) return u;
  const p = validatePassword(data.password || '');
  if (!p.valid) return p;
  if (data.password !== data.confirmPassword) return { valid: false, message: 'Las contraseñas no coinciden' };
  return { valid: true };
}