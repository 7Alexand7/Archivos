import { Routes } from '@angular/router';
import { CrearClase } from './Front-end/view/typescript/crear-clase';
import { GestionCursos } from './Front-end/view/typescript/gestion-cursos';
import { Login } from './Front-end/view/typescript/login';
import { CrearPerfil } from './Front-end/view/typescript/crear-perfil';

import { GestionTareas } from './Front-end/view/typescript/gestion_tareas';
import { GestionTareasEst } from './Front-end/view/typescript/gestion_tareas_est';

import { ConsultarTareaEst } from './Front-end/view/typescript/consultar_tarea_est';
import { ConsultarTarea } from './Front-end/view/typescript/consultar_tarea';

export const routes: Routes = [
    {path: '', component:Login},
    {path: 'crear-perfil', component:CrearPerfil},
    {path: 'register', component: CrearPerfil},
    {path : 'login', component:Login } ,
    {path: 'crear-clase', component: CrearClase },
    {path: 'gestion-cursos', component: GestionCursos },
    { path: 'gestion_tareas', component: GestionTareas },
    { path: 'gestion_tareas_est', component: GestionTareasEst },
    { path: 'consultar_tarea/:id', component: ConsultarTarea },
    { path: 'consultar_tarea_est/:id', component: ConsultarTareaEst },
    {path : '**', redirectTo: '' }
];

