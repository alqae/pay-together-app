import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.isLoading$ = this.authService.isLoading$;
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => this.router.navigate(['/debts']),
    });
  }

  hasError(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  getControlError(field: string, error: string): string {
    const control = this.loginForm.get(field);
    return control?.errors?.[error];
  }
}
