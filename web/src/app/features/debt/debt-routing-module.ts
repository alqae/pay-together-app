import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DebtCreate } from './pages/debt-create/debt-create';
import { DebtDetail } from './pages/debt-detail/debt-detail';
import { DebtList } from './pages/debt-list/debt-list';
import { DebtEdit } from './pages/debt-edit/debt-edit';

const routes: Routes = [
  { path: '', component: DebtList },
  { path: 'create', component: DebtCreate },
  { path: ':id', component: DebtDetail },
  { path: ':id/edit', component: DebtEdit }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtRoutingModule { }
