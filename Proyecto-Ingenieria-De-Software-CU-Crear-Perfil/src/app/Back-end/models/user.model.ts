export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  lastname: string;
  asignatures: string[];
  createdAt: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  lastname: string;
  asignatures: string[];
  confirmPassword: string;
}

export interface LoginData {
  username: string;
  password: string;
}
