import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [ProfileComponent]
})
export class PagesModule { }
