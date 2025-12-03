import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DadosClima } from '../../../../core/interfaces/interfaces-clima';
import { ServicoClima } from '../../../../core/services/servico-clima';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './clima-atual.component.html',
  styleUrls: ['./clima-atual.component.scss'],
})
export class ComponenteClimaAtual {
  @Input() dadosClima: DadosClima | null = null;

  constructor(private servicoClima: ServicoClima) {}

  obterUrlIconeClima(caminhoIcone: string): string {
    return this.servicoClima.obterUrlIconeClima(caminhoIcone);
  }

  obterChanceChuva(): number {
    return this.dadosClima?.atual?.precip_mm || 0;
  }

  obterHoraAtual(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  obterQualidadeAr(): number {
    if (!this.dadosClima) return 0;
    const vis = this.dadosClima.atual.vis_km;
    if (vis >= 10) return 67; // Simulando valor baseado na visibilidade
    if (vis >= 6) return 50;
    return 30;
  }

  calcularPontoOrvalho(): number {
    if (!this.dadosClima) return 0;
    const T = this.dadosClima.atual.temp_c;
    const RH = this.dadosClima.atual.umidade;
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * T) / (b + T) + Math.log(RH / 100);
    return Math.round((b * alpha) / (a - alpha));
  }
}
