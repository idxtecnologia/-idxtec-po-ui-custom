import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoDialogService,
  PoDynamicFormComponent,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { concat, EMPTY, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const actionInsert = 'insert';
const actionUpdate = 'update';

const headers = new HttpHeaders({
  'X-PO-SCREEN-LOCK': 'true',
});

@Directive({
  selector: 'idx-po-persistent',
})
export class IdxPoPersistentComponent implements OnInit, OnDestroy {
  @ViewChild(PoDynamicFormComponent, { static: true })
  dynamicForm: PoDynamicFormComponent;

  formAction = actionInsert;
  gridAction = actionInsert;

  fields = [];
  model: any;
  initialData: any;

  beforeSave: () => void;
  afterSave: () => void;

  readonly subscriptions: Subscription[] = [];

  readonly pageActions: PoPageAction[] = [
    {
      label: 'Salvar',
      action: () => this.save(),
      type: 'primary',
    },
    {
      label: 'Salvar e novo',
      action: () => this.saveNew(),
    },
    {
      label: 'Cancelar',
      action: () => this.cancel(),
    },
  ];

  constructor(
    readonly http: HttpClient,
    readonly activatedRoute: ActivatedRoute,
    readonly poDialog: PoDialogService,
    readonly poNotification: PoNotificationService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDataFromApi();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  }

  save() {
    if (this.dynamicForm.form.invalid) {
      this.poNotification.warning(
        'Formulário precisa ser preenchido corretamente.'
      );
      return;
    }

    if (this.beforeSave) {
      this.beforeSave();
    }

    const saveOperation$ = this.saveOperation();

    this.subscriptions.push(
      saveOperation$.subscribe((message) => {
        if (this.afterSave) {
          this.afterSave();
        }
        this.poNotification.success(message);
        this.router.navigate(['/documento-entrada']);
      })
    );
  }

  saveNew(): void {
    if (this.dynamicForm.form.invalid) {
      this.poNotification.warning(
        'Formulário precisa ser preenchido corretamente.'
      );
      return;
    }

    const saveOperation$ = this.saveOperation();

    this.subscriptions.push(
      saveOperation$.subscribe((message) => {
        this.poNotification.success(message);
        this.router.navigate(['/documento-entrada/new']);
      })
    );
  }

  private saveOperation(): Observable<any> {
    const { serviceApi } = this.activatedRoute.snapshot.data;
    const { id } = this.activatedRoute.snapshot.params;

    const successMsg = id
      ? 'Recurso atualizado com sucesso.'
      : 'Recurso criado com sucesso.';

    const saveOperation$ = this.isUpdateOperation
      ? this.http.put(serviceApi + `/${id}`, this.model, {
          headers,
        })
      : this.http.post(serviceApi, this.model, {
          headers,
        });

    return saveOperation$.pipe(map(() => successMsg));
  }

  cancel() {
    if (this.dynamicForm && this.dynamicForm.form.dirty) {
      this.poDialog.confirm({
        message: 'Tem certeza que deseja cancelar esta operação?',
        title: 'Cancelar',
        confirm: () => this.router.navigate(['/documento-entrada']),
      });
    } else {
      this.router.navigate(['/documento-entrada']);
    }
  }

  get isUpdateOperation() {
    return this.formAction === actionUpdate;
  }

  get isGridUpdateOperation() {
    return this.gridAction === actionUpdate;
  }

  private loadDataFromApi() {
    const { serviceApi } = this.activatedRoute.snapshot.data;
    const { id } = this.activatedRoute.snapshot.params;
    if (serviceApi) {
      const fields$ = this.getFieldsFromApi(serviceApi, id);
      const data$ = this.loadData(serviceApi, id);

      this.subscriptions.push(concat(fields$, data$).subscribe());
    }
  }

  private loadData(serviceApi: string, id: number): Observable<any> {
    if (!id) {
      this.model = this.initialData;
      this.formAction = actionInsert;
      return EMPTY;
    }

    this.formAction = actionUpdate;

    return this.http
      .get(serviceApi + `/${id}`, {
        headers,
      })
      .pipe(tap((response) => (this.model = response)));
  }

  private getFieldsFromApi(serviceApi: string, id: number): Observable<any> {
    const metadataType = id ? 'edit' : 'create';
    return this.http
      .get(`${serviceApi}/metadata?type=${metadataType}`, { headers })
      .pipe(
        tap((response) => {
          this.fields = response.fields;
        })
      );
  }
}
