import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ComponenteBuscaLocalizacao } from '../../shared/components/busca-localizacao/busca-localizacao.component';
import { ComponenteClimaAtual } from './components/clima-atual/clima-atual.component';
import { ComponentePrevisaoClima } from './components/previsao-clima/previsao-clima.component';
import { ComponentePrevisaoHoraria } from './components/previsao-horaria/previsao-horaria.component';
import { ComponenteDetalhesClima } from './components/detalhes-clima/detalhes-clima.component';
import { ServicoClima } from '../../core/services/servico-clima';
import { ServicoGeolocalizacao } from '../../core/services/servico-geolocalizacao';
import { DadosClima, DadosPrevisao } from '../../core/interfaces/interfaces-clima';
import { ServicoDiaSelecionado } from '../../core/services/servico-dia-selecionado';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    ComponenteBuscaLocalizacao,
    ComponenteClimaAtual,
    ComponentePrevisaoClima,
    ComponentePrevisaoHoraria,
    ComponenteDetalhesClima,
  ],
  templateUrl: './clima-component.html',
  styleUrls: ['./clima-component.scss'],
})
export class ComponenteClima implements OnInit, OnDestroy {
  climaAtual: DadosClima | null = null;
  previsao: DadosPrevisao | null = null;
  carregando = false;
  erro = false;
  private subscricaoDia: Subscription | null = null;
  private subscricaoRefresh: Subscription | null = null;
  private indiceDiaSelecionado = 0;
  private ultimaLocalizacao: { lat: number; lon: number } | null = null;
  ultimaAtualizacao: Date | null = null;
  proximaAtualizacao: number = 0;
  private readonly INTERVALO_ATUALIZACAO = 10 * 60 * 1000; // 10 minutos em ms

  constructor(
    private servicoClima: ServicoClima,
    private servicoGeolocalizacao: ServicoGeolocalizacao,
    private snackBar: MatSnackBar,
    private servicoDiaSelecionado: ServicoDiaSelecionado
  ) {}

  ngOnInit(): void {
    // Tenta carregar clima da localização atual ao iniciar
    this.carregarClimaLocalizacaoAtual();

    // Inscrever para mudanças no dia selecionado
    this.subscricaoDia = this.servicoDiaSelecionado.obterDiaSelecionado().subscribe((indice) => {
      this.indiceDiaSelecionado = indice;
    });

    // Iniciar auto-refresh a cada 10 minutos
    this.subscricaoRefresh = interval(this.INTERVALO_ATUALIZACAO).subscribe(() => {
      this.atualizarDados();
    });

    // Atualizar contador de próxima atualização a cada segundo
    interval(1000).subscribe(() => {
      if (this.ultimaAtualizacao) {
        const tempoDecorrido = Date.now() - this.ultimaAtualizacao.getTime();
        this.proximaAtualizacao = Math.max(
          0,
          Math.ceil((this.INTERVALO_ATUALIZACAO - tempoDecorrido) / 1000)
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscricaoDia) {
      this.subscricaoDia.unsubscribe();
    }
    if (this.subscricaoRefresh) {
      this.subscricaoRefresh.unsubscribe();
    }
  }

  carregarClimaLocalizacaoAtual(): void {
    if (!this.servicoGeolocalizacao.geolocalizacaoDisponivel()) {
      this.mostrarMensagem('Geolocalização não disponível neste navegador');
      return;
    }

    this.carregando = true;
    this.erro = false;

    this.servicoGeolocalizacao.obterLocalizacaoAtual().subscribe({
      next: (localizacao) => {
        this.carregarClimaPorCoordenadas(localizacao.latitude, localizacao.longitude);
      },
      error: (erro) => {
        this.carregando = false;
        this.erro = true;
        this.mostrarMensagem(erro);
      },
    });
  }

  carregarClimaPorCidade(cidade: string): void {
    this.carregando = true;
    this.erro = false;

    this.servicoClima.obterClimaAtualPorCidade(cidade).subscribe({
      next: (clima) => {
        this.climaAtual = clima;
        this.carregarPrevisaoPorCoordenadas(clima.localizacao.lat, clima.localizacao.lon);
      },
      error: (erro) => {
        this.carregando = false;
        this.erro = true;
        this.mostrarMensagem(erro.message);
      },
    });
  }

  private carregarClimaPorCoordenadas(lat: number, lon: number): void {
    this.ultimaLocalizacao = { lat, lon };
    this.servicoClima.obterClimaAtualPorCoordenadas(lat, lon).subscribe({
      next: (clima) => {
        this.climaAtual = clima;
        this.carregarPrevisaoPorCoordenadas(lat, lon);
      },
      error: (erro) => {
        this.carregando = false;
        this.erro = true;
        this.mostrarMensagem(erro.message);
      },
    });
  }

  private carregarPrevisaoPorCoordenadas(lat: number, lon: number): void {
    this.servicoClima.obterPrevisaoPorCoordenadas(lat, lon).subscribe({
      next: (previsao) => {
        this.previsao = previsao;
        this.carregando = false;
        this.erro = false;
        this.ultimaAtualizacao = new Date();
        this.proximaAtualizacao = this.INTERVALO_ATUALIZACAO / 1000;
      },
      error: (erro) => {
        this.carregando = false;
        this.mostrarMensagem(erro.message);
      },
    });
  }

  private mostrarMensagem(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  atualizarDados(): void {
    if (this.ultimaLocalizacao) {
      this.carregarClimaPorCoordenadas(this.ultimaLocalizacao.lat, this.ultimaLocalizacao.lon);
    } else {
      this.carregarClimaLocalizacaoAtual();
    }
  }

  atualizarManualmente(): void {
    this.atualizarDados();
    this.mostrarMensagem('Atualizando dados do clima...');
  }

  formatarTempoAtualizacao(): string {
    if (!this.ultimaAtualizacao) return 'Carregando...';
    return this.ultimaAtualizacao.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatarProximaAtualizacao(): string {
    const minutos = Math.floor(this.proximaAtualizacao / 60);
    const segundos = this.proximaAtualizacao % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  obterEstatisticas() {
    if (!this.previsao) return null;

    const previsaoDia = this.previsao.previsao.diasPrevisao[this.indiceDiaSelecionado];
    if (!previsaoDia) return null;

    const horas = previsaoDia.hora;

    // Se for o dia atual, mostrar estatísticas das próximas 12h
    // Se for dia futuro, mostrar estatísticas do dia inteiro
    const ehHoje = this.indiceDiaSelecionado === 0;
    const agora = new Date().getHours();
    const horasFiltradas = ehHoje ? horas.slice(agora, agora + 12) : horas;

    if (horasFiltradas.length === 0) return null;

    return {
      maxTemp: Math.max(...horasFiltradas.map((h) => h.temp_c)),
      minTemp: Math.min(...horasFiltradas.map((h) => h.temp_c)),
      mediaUmidade: Math.round(
        horasFiltradas.reduce((soma, h) => soma + h.umidade, 0) / horasFiltradas.length
      ),
      maxVento: Math.max(...horasFiltradas.map((h) => h.vento_kph)),
      totalChuva: Math.max(...horasFiltradas.map((h) => h.chance_chuva)),
    };
  }

  obterUrlIcone(caminhoIcone: string): string {
    return this.servicoClima.obterUrlIconeClima(caminhoIcone);
  }
}
