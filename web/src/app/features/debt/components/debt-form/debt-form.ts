import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt-service';
import { Debt } from '@core/models/debt.model';

@Component({
  selector: 'app-debt-form',
  standalone: false,
  templateUrl: './debt-form.html',
  styleUrl: './debt-form.css'
})
export class DebtForm implements OnInit {
  public debtForm: FormGroup;
  public isLoading$: Observable<boolean>;

  @Input("defaultValue") public defaultValue: Debt | undefined;
  @Output("onSubmit") onSubmitOutput: EventEmitter<Debt> = new EventEmitter<Debt>();

  constructor(
    private formBuilder: FormBuilder,
    private debtService: DebtService
  ) {
    this.isLoading$ = this.debtService.isLoading$;
    this.debtForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      dueDate: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.defaultValue) {
      this.debtForm.patchValue({
        ...this.defaultValue,
        dueDate: this.formatDate(this.defaultValue.dueDate),
      });
    }
  }

  onSubmit() {
    this.onSubmitOutput.emit(this.debtForm.value);
  }

  private formatDate(date: string): string {
    // 2025-08-31T18:24:25.861Z
    return date.split('T')[0];
  }

  hasError(field: string): boolean {
    const control = this.debtForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  getControlError(field: string, error: string): string {
    const control = this.debtForm.get(field);
    return control?.errors?.[error];
  }
}
