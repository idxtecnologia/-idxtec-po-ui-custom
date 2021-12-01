import { NgModule } from '@angular/core';
import { IdxPoGridModule } from './idx-po-grid/idx-po-grid.module';
import { IdxPoPageDynamicEditModule } from './idx-po-page-dynamic-edit';
import { IdxPoPageDynamicTableModule } from './idx-po-page-dynamic-table';
import { IdxPoPersistentComponent } from './idx-po-persistent/idx-po-persistent.component';

@NgModule({
  declarations: [IdxPoPersistentComponent],
  imports: [
    IdxPoGridModule,
    IdxPoPageDynamicEditModule,
    IdxPoPageDynamicTableModule,
  ],
  exports: [
    IdxPoGridModule,
    IdxPoPageDynamicEditModule,
    IdxPoPageDynamicTableModule,
    IdxPoPersistentComponent,
  ],
})
export class IdxtecPoUiCustomModule {}
