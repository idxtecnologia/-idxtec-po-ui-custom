import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { PoPageDynamicEditActions, PoPageDynamicEditBeforeCancel, PoPageDynamicEditBeforeSave, PoPageDynamicEditBeforeSaveNew } from '@po-ui/ng-templates';

interface ExecuteActionParameter {
  action: string | Function;
  id?: string | number;
  resource?: any;
}

@Injectable({
  providedIn: 'root'
})
export class IdxPoPageDynamicEditActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeCancel(action: PoPageDynamicEditActions['beforeCancel']): Observable<PoPageDynamicEditBeforeCancel> {
    return this.executeAction({ action });
  }

  beforeSave(
    action: PoPageDynamicEditActions['beforeSave'],
    id: string,
    body: any
  ): Observable<PoPageDynamicEditBeforeSave> {
    const resource = body ?? {};
    return this.executeAction({ action, resource, id });
  }

  beforeSaveNew(
    action: PoPageDynamicEditActions['beforeSaveNew'],
    id: string,
    body: any
  ): Observable<PoPageDynamicEditBeforeSaveNew> {
    const resource = body ?? {};
    return this.executeAction({ action, resource, id });
  }

  private executeAction<T>({ action, resource = {}, id }: ExecuteActionParameter): Observable<T> {
    if (!action) {
      return of(<T>{});
    }

    if (typeof action === 'string') {
      const url = id ? `${action}/${id}` : action;

      return this.http.post<T>(url, resource, { headers: this.headers });
    }

    return of(action(resource, id));
  }
}
