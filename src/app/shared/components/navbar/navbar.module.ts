import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component'
// import { NavbarRoutingModule } from './navbar-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    // NavbarRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule {}