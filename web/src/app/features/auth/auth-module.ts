import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Register } from '@auth/components/register/register';
import { AuthRoutingModule } from '@auth/auth-routing-module';
import { Login } from '@auth/components/login/login';
import { CoreModule } from '@core/core-module';

@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
