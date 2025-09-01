import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtDetail } from '@debt/pages/debt-detail/debt-detail';
import { DebtCreate } from '@debt/pages/debt-create/debt-create';
import { DebtRoutingModule } from '@debt/debt-routing-module';
import { DebtList } from '@debt/pages/debt-list/debt-list';
import { DebtEdit } from '@debt/pages/debt-edit/debt-edit';

@NgModule({
  declarations: [
    DebtList,
    DebtCreate,
    DebtEdit,
    DebtDetail
  ],
  imports: [
    CommonModule,
    DebtRoutingModule
  ]
})
export class DebtModule { }
