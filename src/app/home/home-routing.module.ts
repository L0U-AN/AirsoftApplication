import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { EventDetailPageModule } from '../events/event-detail/event-detail.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('../events/event-detail/event-detail.module').then( m => m.EventDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
