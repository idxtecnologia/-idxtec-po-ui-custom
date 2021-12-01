import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoPageDynamicTableActions, PoPageDynamicTableBeforeDuplicate, PoPageDynamicTableBeforeEdit, PoPageDynamicTableBeforeNew, PoPageDynamicTableBeforeRemove, PoPageDynamicTableBeforeRemoveAll, PoPageDynamicTableBeforeDetail, PoPageDynamicTableCustomAction } from '@po-ui/ng-templates';

import { Observable, of } from 'rxjs';

interface ExecuteActionParameter {
  action: string | Function;
  resource?: any;
  id?: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicTableActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeDuplicate(
    action: PoPageDynamicTableActions['beforeDuplicate'],
    id: any,
    body: any
  ): Observable<PoPageDynamicTableBeforeDuplicate> {
    const resource = body ?? {};

    return this.executeAction({ action, resource, id });
  }

  beforeEdit(
    action: PoPageDynamicTableActions['beforeEdit'],
    id: any,
    body: any
  ): Observable<PoPageDynamicTableBeforeEdit> {
    const resource = body ?? {};

    return this.executeAction({ action, resource, id });
  }

  beforeNew(action?: PoPageDynamicTableActions['beforeNew']): Observable<PoPageDynamicTableBeforeNew> {
    return this.executeAction({ action });
  }

  beforeRemove(
    action: PoPageDynamicTableActions['beforeRemove'],
    id: string,
    resource: any
  ): Observable<PoPageDynamicTableBeforeRemove> {
    return this.executeAction({ action, id, resource });
  }

  beforeRemoveAll(
    action: PoPageDynamicTableActions['beforeRemoveAll'],
    resources: Array<any>
  ): Observable<PoPageDynamicTableBeforeRemoveAll> {
    return this.executeAction({ action, resource: resources });
  }

  beforeDetail(
    action: PoPageDynamicTableActions['beforeDetail'],
    id: string,
    resource: any
  ): Observable<PoPageDynamicTableBeforeDetail> {
    return this.executeAction({ action, id, resource });
  }

  customAction(action: PoPageDynamicTableCustomAction['action'], resource: any = []) {
    return this.executeAction({ action, resource });
  }

  private executeAction<T>({ action, resource = {}, id }: ExecuteActionParameter): Observable<T> {
    if (!action) {
      return of(<T>{});
    }

    if (typeof action === 'string') {
      const url = id ? `${action}/${id}` : action;

      return this.http.post<T>(url, resource, { headers: this.headers });
    }
    if (id) {
      return of(action(id, resource));
    }
    return of(action(resource));
  }
}