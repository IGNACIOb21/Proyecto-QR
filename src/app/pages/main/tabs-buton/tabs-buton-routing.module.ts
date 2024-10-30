import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsButonPage } from './tabs-buton.page';

const routes: Routes = [
  {
    path: '',
    component: TabsButonPage,
    children: [
      {
        path: '',
        redirectTo: 'home',  // Redirige a 'home' por defecto
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./../configuracion/configuracion.module').then(m => m.ConfiguracionPageModule)
      },
      {
        path: 'estadisticas',
        loadChildren: () => import('./../estadisticas/estadisticas.module').then(m => m.EstadisticasPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsButonPageRoutingModule {}
