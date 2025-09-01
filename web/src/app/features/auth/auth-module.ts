import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Register } from '@auth/components/register/register';
import { AuthRoutingModule } from '@auth/auth-routing-module';
import { Login } from '@auth/components/login/login';

@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
