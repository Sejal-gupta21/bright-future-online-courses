import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AutofocusDirective } from './directives/autofocus.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';


@NgModule({
  declarations: [
    NavbarComponent,
    AutofocusDirective,
    CapitalizePipe,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    NavbarComponent,
    HttpClientModule,
    AutofocusDirective,
    CapitalizePipe,
  ],
})
export class SharedModule {}
