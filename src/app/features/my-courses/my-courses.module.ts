import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCoursesComponent } from '../my-courses/my-courses/my-courses.component';
import { MyCoursesRoutingModule } from './my-courses-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MyCoursesComponent],
  imports: [CommonModule, SharedModule, MyCoursesRoutingModule]
})
export class MyCoursesModule {}