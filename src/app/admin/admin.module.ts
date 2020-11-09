import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import {AuthService} from "./shared/services/auth.service";
import {SharedModule} from "../shared/shared.module";
const routes: Routes = [
  { path: '', component: AdminLayoutComponent, children: [
      {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'post/:id/edit', component: EditPageComponent},
      {path: 'create', component: CreatePageComponent},

    ]
  }
]

@NgModule({
  declarations: [AdminLayoutComponent, LoginPageComponent, DashboardPageComponent, CreatePageComponent, EditPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  providers: [AuthService],
})
export class AdminModule {

}
