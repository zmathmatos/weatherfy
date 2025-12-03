import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicoDiaSelecionado {
  private indiceDiaSelecionado$ = new BehaviorSubject<number>(0);

  obterDiaSelecionado(): Observable<number> {
    return this.indiceDiaSelecionado$.asObservable();
  }

  selecionarDia(indice: number): void {
    this.indiceDiaSelecionado$.next(indice);
  }

  obterIndiceDiaAtual(): number {
    return this.indiceDiaSelecionado$.value;
  }
}
