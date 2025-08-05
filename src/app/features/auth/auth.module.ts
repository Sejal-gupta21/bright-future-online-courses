import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AuthRoutingModule,
    MatSnackBarModule
  ],
  exports: [AuthComponent]
})
export class AuthModule {}