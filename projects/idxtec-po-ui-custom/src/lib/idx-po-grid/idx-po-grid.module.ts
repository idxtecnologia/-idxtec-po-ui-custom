import { NgModule } from '@angular/core';
import { IdxPoGridComponent } from './idx-po-grid.component';
import { PoModalModule, PoModule } from '@po-ui/ng-components';

@NgModule({
  declarations: [IdxPoGridComponent],
  imports: [PoModule, PoModalModule],
  exports: [IdxPoGridComponent],
})
export class IdxPoGridModule {}
