import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-localizacao.component.html',
  styleUrls: ['./busca-localizacao.component.scss'],
})
export class ComponenteBuscaLocalizacao {
  @Output() buscarCidade = new EventEmitter<string>();
  @Output() obterLocalizacaoAtual = new EventEmitter<void>();

  nomeCidade: string = '';

  aoBuscar(): void {
    if (this.nomeCidade.trim()) {
      this.buscarCidade.emit(this.nomeCidade.trim());
    }
  }

  aoObterLocalizacaoAtual(): void {
    this.obterLocalizacaoAtual.emit();
  }

  aoPressionarTecla(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.aoBuscar();
    }
  }
}
