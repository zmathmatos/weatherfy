import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DadosPrevisao } from '../../../../core/interfaces/interfaces-clima';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ServicoDiaSelecionado } from '../../../../core/services/servico-dia-selecionado';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './previsao-horaria.component.html',
  styleUrls: ['./previsao-horaria.component.scss'],
})
export class ComponentePrevisaoHoraria implements OnChanges, AfterViewInit, OnDestroy {
  @Input() dadosPrevisao: DadosPrevisao | null = null;
  @ViewChild('graficoTemperatura') referenciaGraficoTemperatura!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoChuva') referenciaGraficoChuva!: ElementRef<HTMLCanvasElement>;

  private graficoTemperatura: Chart | null = null;
  private graficoChuva: Chart | null = null;
  private subscricaoDia: Subscription | null = null;
  private indiceDiaSelecionado = 0;

  constructor(private servicoDiaSelecionado: ServicoDiaSelecionado) {
    this.subscricaoDia = this.servicoDiaSelecionado.obterDiaSelecionado().subscribe((indice) => {
      this.indiceDiaSelecionado = indice;
      if (this.dadosPrevisao) {
        this.criarGraficos();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscricaoDia) {
      this.subscricaoDia.unsubscribe();
    }
    if (this.graficoTemperatura) {
      this.graficoTemperatura.destroy();
    }
    if (this.graficoChuva) {
      this.graficoChuva.destroy();
    }
  }

  ngAfterViewInit(): void {
    if (this.dadosPrevisao) {
      this.criarGraficos();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosPrevisao'] && !changes['dadosPrevisao'].firstChange && this.dadosPrevisao) {
      this.criarGraficos();
    }
  }

  private criarGraficos(): void {
    if (!this.dadosPrevisao || !this.referenciaGraficoTemperatura || !this.referenciaGraficoChuva)
      return;

    const diaPrevisao = this.dadosPrevisao.previsao.diasPrevisao[this.indiceDiaSelecionado];
    if (!diaPrevisao) return;

    const dadosHorarios = diaPrevisao.hora.slice(0, 24);
    const rotulos = dadosHorarios.map((h) => new Date(h.tempo).getHours() + 'h');
    const temperaturas = dadosHorarios.map((h) => h.temp_c);
    const chancesChuva = dadosHorarios.map((h) => h.chance_chuva);

    this.criarGraficoTemperatura(rotulos, temperaturas);
    this.criarGraficoChuva(rotulos, chancesChuva);
  }

  private criarGraficoTemperatura(rotulos: string[], dados: number[]): void {
    if (this.graficoTemperatura) {
      this.graficoTemperatura.destroy();
    }

    const ctx = this.referenciaGraficoTemperatura.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: rotulos,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: dados,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(255, 206, 86, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: { size: 14 },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              callback: (value) => value + '°C',
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
            },
          },
        },
      },
    };

    this.graficoTemperatura = new Chart(ctx, config);
  }

  private criarGraficoChuva(rotulos: string[], dados: number[]): void {
    if (this.graficoChuva) {
      this.graficoChuva.destroy();
    }

    const ctx = this.referenciaGraficoChuva.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: rotulos,
        datasets: [
          {
            label: 'Chance de Chuva (%)',
            data: dados,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: { size: 14 },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              callback: (value) => value + '%',
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
            },
          },
        },
      },
    };

    this.graficoChuva = new Chart(ctx, config);
  }
}
