import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerrainPage } from './terrain.page';

const routes: Routes = [
  {
    path: '',
    component: TerrainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerrainPageRoutingModule {}
