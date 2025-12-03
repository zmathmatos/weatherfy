import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DadosPrevisao } from '../../../../core/interfaces/interfaces-clima';
import { ServicoDiaSelecionado } from '../../../../core/services/servico-dia-selecionado';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule],
  templateUrl: './detalhes-clima.component.html',
  styleUrls: ['./detalhes-clima.component.scss'],
})
export class ComponenteDetalhesClima implements OnDestroy {
  @Input() dadosPrevisao: DadosPrevisao | null = null;
  private subscricaoDia: Subscription | null = null;
  private indiceDiaSelecionado = 0;

  constructor(private servicoDiaSelecionado: ServicoDiaSelecionado) {
    this.subscricaoDia = this.servicoDiaSelecionado.obterDiaSelecionado().subscribe((indice) => {
      this.indiceDiaSelecionado = indice;
    });
  }

  ngOnDestroy(): void {
    if (this.subscricaoDia) {
      this.subscricaoDia.unsubscribe();
    }
  }

  get previsaoHoje() {
    return this.dadosPrevisao?.previsao.diasPrevisao[this.indiceDiaSelecionado];
  }

  get estatisticasHorarias() {
    if (!this.previsaoHoje) return null;

    const horas = this.previsaoHoje.hora;
    const agora = new Date().getHours();
    const proximasHoras = horas.slice(agora, agora + 12);

    return {
      maxTemp: Math.max(...proximasHoras.map((h) => h.temp_c)),
      minTemp: Math.min(...proximasHoras.map((h) => h.temp_c)),
      mediaUmidade: Math.round(
        proximasHoras.reduce((soma, h) => soma + h.umidade, 0) / proximasHoras.length
      ),
      maxVento: Math.max(...proximasHoras.map((h) => h.vento_kph)),
      totalChuva:
        (proximasHoras.reduce((soma, h) => soma + h.chance_chuva / 100, 0) / proximasHoras.length) *
        100,
    };
  }

  obterEstatisticas() {
    return this.estatisticasHorarias;
  }

  obterNivelUV(uv: number): string {
    if (uv <= 2) return 'Baixo';
    if (uv <= 5) return 'Moderado';
    if (uv <= 7) return 'Alto';
    if (uv <= 10) return 'Muito Alto';
    return 'Extremo';
  }

  obterCorUV(uv: number): string {
    if (uv <= 2) return '#4caf50';
    if (uv <= 5) return '#ffeb3b';
    if (uv <= 7) return '#ff9800';
    if (uv <= 10) return '#f44336';
    return '#9c27b0';
  }

  obterQualidadeAr(): string {
    if (!this.dadosPrevisao?.atual) return 'Desconhecido';

    const vis = this.dadosPrevisao.atual.vis_km;
    if (vis >= 10) return 'Excelente';
    if (vis >= 6) return 'Bom';
    if (vis >= 3) return 'Moderado';
    return 'Ruim';
  }

  obterQualidadeArReal(): string {
    if (!this.dadosPrevisao?.atual?.qualidade_ar) return 'Desconhecido';

    const indice = this.dadosPrevisao.atual.qualidade_ar['us-epa-index'];
    switch (indice) {
      case 1:
        return 'Boa';
      case 2:
        return 'Moderada';
      case 3:
        return 'Não saudável para grupos sensíveis';
      case 4:
        return 'Não saudável';
      case 5:
        return 'Muito não saudável';
      case 6:
        return 'Perigosa';
      default:
        return 'Desconhecido';
    }
  }

  obterNivelConforto(): string {
    if (!this.dadosPrevisao?.atual) return 'Desconhecido';

    const temp = this.dadosPrevisao.atual.temp_c;
    const umidade = this.dadosPrevisao.atual.umidade;

    if (temp >= 20 && temp <= 26 && umidade >= 40 && umidade <= 60) {
      return 'Confortável';
    } else if (temp > 30 || umidade > 70) {
      return 'Desconfortável';
    } else if (temp < 15) {
      return 'Frio';
    }
    return 'Moderado';
  }

  calcularPorcentagemPM25(valor: number): number {
    return Math.min((valor / 50) * 100, 100);
  }

  calcularPorcentagemPM10(valor: number): number {
    return Math.min((valor / 100) * 100, 100);
  }

  calcularPorcentagemCO(valor: number): number {
    return Math.min((valor / 10) * 100, 100);
  }

  calcularPorcentagemNO2(valor: number): number {
    return Math.min((valor / 40) * 100, 100);
  }

  calcularPorcentagemSO2(valor: number): number {
    return Math.min((valor / 20) * 100, 100);
  }

  calcularPorcentagemO3(valor: number): number {
    return Math.min((valor / 100) * 100, 100);
  }
}
