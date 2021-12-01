import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PoPageDynamicModule } from "@po-ui/ng-templates";
import { IdxPoPageDynamicEditComponent } from "./idx-po-page-dynamic-edit.component";

import { 
  PoButtonModule, 
  PoDividerModule, 
  PoDynamicModule, 
  PoGridModule, 
  PoPageModule, 
  PoTableModule, 
  PoWidgetModule 
} from "@po-ui/ng-components";

@NgModule({
  declarations: [
    IdxPoPageDynamicEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoButtonModule,
    PoDividerModule,
    PoDynamicModule,
    PoGridModule,
    PoTableModule,
    PoPageModule,
    PoWidgetModule,
    PoPageDynamicModule
  ],
  exports: [
    IdxPoPageDynamicEditComponent
  ]
})
export class IdxPoPageDynamicEditModule { }