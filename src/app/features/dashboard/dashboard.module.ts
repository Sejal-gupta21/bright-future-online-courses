import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
