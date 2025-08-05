import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from '../details/details/details.component';
import { DetailsRoutingModule } from './details-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DetailsComponent],
  imports: [CommonModule, SharedModule, DetailsRoutingModule, RouterModule]
})
export class DetailsModule {}