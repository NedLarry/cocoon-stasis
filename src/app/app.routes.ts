import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'AppianWay — Your active edge.',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'approach',
    title: 'Approach — AppianWay',
    loadComponent: () => import('./pages/approach/approach').then((m) => m.Approach),
  },
  {
    path: 'technology',
    title: 'Technology — AppianWay',
    loadComponent: () => import('./pages/technology/technology').then((m) => m.Technology),
  },
  {
    path: 'careers',
    title: 'Careers — AppianWay',
    loadComponent: () => import('./pages/careers/careers').then((m) => m.Careers),
  },
  {
    path: 'contact',
    title: 'Contact — AppianWay',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    title: 'Off the road — AppianWay',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
