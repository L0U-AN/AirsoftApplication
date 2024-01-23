import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventDetailPage } from './event-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage
  },
  {
    path: 'terrain',
    loadChildren: () => import('./terrain/terrain.module').then( m => m.TerrainPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventDetailPageRoutingModule {}
