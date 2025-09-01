import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtEdit } from './debt-edit';

describe('DebtEdit', () => {
  let component: DebtEdit;
  let fixture: ComponentFixture<DebtEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
