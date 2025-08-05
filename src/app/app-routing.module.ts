import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  {path : 'dashboard', loadChildren:()=>import('./features/dashboard/dashboard.module').then(m=>m.DashboardModule), canActivate: [AuthGuard]},
    { path: 'enroll', loadChildren: () => import('../app/features/enrollment/enrollment.module').then(m => m.EnrollmentModule), canActivate: [AuthGuard] },
  { path: 'details/:id', loadChildren: () => import('../app/features/details/details.module').then(m => m.DetailsModule) , canActivate: [AuthGuard]},
  { path: 'my-courses', loadChildren: () => import('../app/features/my-courses/my-courses.module').then(m => m.MyCoursesModule), canActivate: [AuthGuard] },
  { path: 'payment', loadChildren: () => import('../app/features/payment/payment.module').then(m => m.PaymentModule), canActivate: [AuthGuard] },
  {path: '**' , loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule), canActivate: [AuthGuard] } ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}