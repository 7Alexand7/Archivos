import { Routes } from '@angular/router';
import { CrearClase } from './Front-end/view/typescript/crear-clase';
import { GestionCursos } from './Front-end/view/typescript/gestion-cursos';
import { Login } from './Front-end/view/typescript/login';
import { CrearPerfil } from './Front-end/view/typescript/crear-perfil';

export const routes: Routes = [
    {path: '', component:Login},
    {path: 'crear-perfil', component:CrearPerfil},
    {path: 'register', component: CrearPerfil},
    {path : 'login', component:Login } ,
    {path: 'crear-clase', component: CrearClase },
    {path: 'gestion-cursos', component: GestionCursos },
    {path : '**', redirectTo: '' }
];

