import { QuranComponent } from './Core/layouts/Courses/quran/quran.component';
import { Routes } from '@angular/router';
import { HeroComponent } from './Core/layouts/Home/hero/hero.component';
import { ArabicComponent } from './Core/layouts/Courses/arabic/arabic.component';
import { IslamicComponent } from './Core/layouts/Courses/islamic/islamic.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ContactsDashboardComponent } from './features/dashboard/contacts-dashboard/contacts-dashboard.component';
import { authGuard } from './Core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'courses/quran',
    loadComponent:()=>import('./Core/layouts/Courses/quran/quran.component').then(m=>m.QuranComponent)
  },
  { path: 'courses/arabic',
    loadComponent:()=>import('./Core/layouts/Courses/arabic/arabic.component').then(m=>m.ArabicComponent)
  },
  { path: 'courses/islamic',
    loadComponent:()=>import('./Core/layouts/Courses/islamic/islamic.component').then(m=>m.IslamicComponent)
  },
  { path: 'login',
    loadComponent:()=>import('./features/auth/login/login.component').then(m=>m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/dashboard/contacts-dashboard/contacts-dashboard.component')
            .then(m => m.ContactsDashboardComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/contacts-dashboard/contacts-dashboard.component')
            .then(m => m.ContactsDashboardComponent)
      }
    ]
  },
];
