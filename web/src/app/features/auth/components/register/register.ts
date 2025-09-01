import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Auth } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]]
    });

    this.isLoading$ = this.auth.isLoading$;
  }

  onSubmit() {
    this.auth.register(
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.name,
    ).subscribe({
      next: () => this.router.navigate(['/debts']),
    });
  }

  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  getControlError(field: string, error: string): string {
    const control = this.registerForm.get(field);
    return control?.errors?.[error];
  }
}
