import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentComponent } from '../enrollment/enrollment/enrollment.component';
import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [EnrollmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EnrollmentRoutingModule,
        MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
})
export class EnrollmentModule {}
