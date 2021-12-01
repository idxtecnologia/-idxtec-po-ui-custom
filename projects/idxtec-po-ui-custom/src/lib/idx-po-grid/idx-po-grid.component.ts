import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  PoDynamicFormComponent,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

const actionInsert = 'insert';
const actionUpdate = 'update';

const headers = new HttpHeaders({
  'X-PO-SCREEN-LOCK': 'true',
});

@Component({
  selector: 'idx-po-grid',
  templateUrl: './idx-po-grid.component.html',
})
export class IdxPoGridComponent implements OnInit, OnDestroy {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  @ViewChild(PoDynamicFormComponent, { static: true })
  poDynamicForm: PoDynamicFormComponent;

  @Input('p-model') model: any;
  @Output('p-model-change') modelChange = new EventEmitter<any>();

  @Input('p-columns') columns: PoTableColumn[];

  @Input('p-title') title: string;
  @Input('p-fields') fields: any[];
  @Input('p-value') value: any;
  @Input('p-auto-focus') autoFocus: string;

  @Input('p-service-api') serviceApi: string;

  secondaryAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.poModal?.close(),
  };

  actions: PoTableAction[] = [
    {
      label: 'Editar',
      action: this.editItem.bind(this),
    },
    {
      label: 'Remover',
      action: this.deleteItem.bind(this),
      type: 'danger',
      separator: true,
    },
  ];

  formAction = actionInsert;

  readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    if (this.serviceApi) {
      const columns$ = this.getColumns();
      this.subscriptions.push(columns$.subscribe());
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  }

  close() {
    this.poModal.close();
  }

  addItem() {
    this.subscriptions.push(this.getFields().subscribe());
    this.value = { item: this.getRowNumber() };
    this.formAction = actionInsert;
    this.poModal.primaryAction = {
      label: 'Confirmar',
      action: () => this.save(),
    };
    this.poDynamicForm.disabledForm = false;
    this.poModal.open();
  }

  editItem(data: any) {
    this.subscriptions.push(this.getFields().subscribe());
    this.formAction = actionUpdate;
    this.value = data;
    this.poModal.primaryAction = {
      label: 'Atualizar',
      action: () => this.save(),
    };
    this.poDynamicForm.disabledForm = false;
    this.poModal.open();
  }

  deleteItem(data: any) {
    this.subscriptions.push(this.getFields().subscribe());
    this.value = data;
    this.poModal.primaryAction = {
      label: 'Remover',
      danger: true,
      action: () => this.delete(data),
    };
    this.poDynamicForm.disabledForm = true;
    this.poModal.open();
  }

  private save() {
    if (this.poDynamicForm.form.invalid) {
      const message = 'Formulário precisa ser preenchido corretamente.';
      this.poNotification.warning(message);
      return;
    }

    this.value['$updated'] = this.isUpdateOperation;
    this.modelChange.emit(this.value);
    this.close();
  }

  private delete(data: any) {
    const rowIndex = this.getRowIndex(data.item);
    const newArray = [...this.model.items];

    newArray.splice(rowIndex, 1);

    this.model.items = newArray;
    this.close();
  }

  private getRowIndex(rowNumber: number): number {
    return this.model.items.findIndex(
      (record: any) => record.item === rowNumber
    );
  }

  get isUpdateOperation() {
    return this.formAction === actionUpdate;
  }

  private getRowNumber(): number {
    const length = this.model.items.length;
    let item = 1;

    if (length > 0) {
      const lastLine = this.model.items[length - 1];
      item = Number(lastLine.item) + 1;
    }

    return item;
  }

  private getColumns(): Observable<any> {
    return this.http
      .get(this.serviceApi + `/metadata?type=list`, { headers })
      .pipe(tap((response: any) => (this.columns = response.fields)));
  }

  private getFields(): Observable<any> {
    const metadataType = this.isUpdateOperation ? 'edit' : 'create';
    return this.http
      .get(this.serviceApi + `/metadata?type=${metadataType}`, {
        headers,
      })
      .pipe(tap((response: any) => (this.fields = response.fields)));
  }
}
