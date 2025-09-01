import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtCreate } from './debt-create';

describe('DebtCreate', () => {
  let component: DebtCreate;
  let fixture: ComponentFixture<DebtCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
