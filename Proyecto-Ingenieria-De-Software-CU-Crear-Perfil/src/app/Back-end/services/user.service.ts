import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await firstValueFrom(this.http.get<User[]>(this.API_URL));
    } catch (error) {
      return [];
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    return users.find(user => user.username === username);
  }

  async createUser(username: string, password: string, name:string, lastname:string, asignatures:string[]): Promise<User> {
    const newUser: User = {
      id: this.generateId(),
      username,
      password,
      name,
      lastname,
      asignatures,
      createdAt: new Date().toISOString()
    };

    return await firstValueFrom(this.http.post<User>(this.API_URL, newUser));
  }

  async userExists(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user !== undefined;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
