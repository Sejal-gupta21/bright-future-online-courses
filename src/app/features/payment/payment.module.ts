import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglePayButtonModule } from '@google-pay/button-angular'; // <-- IMPORT HERE
import { PaymentComponent } from '../payment/payment/payment.component';
import { RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- ADD THIS
import { MatSnackBarModule} from '@angular/material/snack-bar';

// Define routes for this feature module
const routes: Routes = [
  { path: '', component: PaymentComponent }
];

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    GooglePayButtonModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ]
})
export class PaymentModule {}