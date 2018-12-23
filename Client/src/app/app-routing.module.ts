import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "sign-in", pathMatch: "full" },
  { path: "sign-in", loadChildren: "./sign-in/sign-in.module#SignInPageModule" },
  { path: "sign-up", loadChildren: "./sign-up/sign-up.module#SignUpPageModule" },
  { path: "vis", loadChildren: "./vis/vis.module#VisPageModule" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
