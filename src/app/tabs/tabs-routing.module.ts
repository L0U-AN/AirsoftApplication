import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { OrganizerGuard } from '../core/organizer.guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../events/events.module').then((m) => m.EventsPageModule),
          },
          {
            path: ':eventId',
            loadChildren: () =>
              import('../events/event-detail/event-detail.module').then(
                (m) => m.EventDetailPageModule
              ),
          },
          {
            path: ':eventId/:terrainId',
            loadChildren: () =>
              import(
                '../events/event-detail/terrain/terrain.module'
              ).then((m) => m.TerrainPageModule),
          },
        ],
      },
      {
        path: 'favorites',
        loadChildren: () =>
          import('../favorites/favorites.module').then(
            (m) => m.FavoritesPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },

      {
        path: 'map',
        loadChildren: () =>
          import('../map/map-home.module').then((m) => m. HomePageModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat-home/chat-home.module').then((m) => m. ChatHomePageModule),
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
