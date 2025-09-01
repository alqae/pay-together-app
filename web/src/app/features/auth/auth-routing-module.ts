import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Register } from './components/register/register';
import { Login } from './components/login/login';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
