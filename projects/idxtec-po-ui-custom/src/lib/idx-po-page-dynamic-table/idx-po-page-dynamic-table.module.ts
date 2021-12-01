import { NgModule } from '@angular/core';
import { IdxPoPageDynamicTableComponent } from './idx-po-page-dynamic-table.component';
import {
  PoPageCustomizationModule,
  PoPageDynamicModule,
  PoPageDynamicSearchModule,
  PoPageDynamicTableModule,
} from '@po-ui/ng-templates';
import { PoTableModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [IdxPoPageDynamicTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoTableModule,

    PoPageCustomizationModule,
    PoPageDynamicModule,
    PoPageDynamicTableModule,
    PoPageDynamicSearchModule,
  ],
  exports: [IdxPoPageDynamicTableComponent],
})
export class IdxPoPageDynamicTableModule {}
