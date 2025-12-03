import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DadosPrevisao, DiaPrevisao } from '../../../../core/interfaces/interfaces-clima';
import { ServicoClima } from '../../../../core/services/servico-clima';
import { ServicoDiaSelecionado } from '../../../../core/services/servico-dia-selecionado';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './previsao-clima.component.html',
  styleUrls: ['./previsao-clima.component.scss'],
})
export class ComponentePrevisaoClima implements OnInit, OnDestroy {
  @Input() dadosPrevisao: DadosPrevisao | null = null;
  @ViewChild('containerCarrossel') containerCarrossel!: ElementRef;

  paginaAtual = 0;
  diasPorPagina = 7;
  cardAtivoIndex: number | null = null;
  private subscricaoDia: Subscription | null = null;
  private diaSelecionadoGlobal = 0;

  constructor(
    private servicoClima: ServicoClima,
    private servicoDiaSelecionado: ServicoDiaSelecionado
  ) {}

  ngOnInit(): void {
    this.subscricaoDia = this.servicoDiaSelecionado.obterDiaSelecionado().subscribe((indice) => {
      this.diaSelecionadoGlobal = indice;
    });
  }

  ngOnDestroy(): void {
    if (this.subscricaoDia) {
      this.subscricaoDia.unsubscribe();
    }
  }

  obterUrlIconeClima(caminhoIcone: string): string {
    return this.servicoClima.obterUrlIconeClima(caminhoIcone);
  }

  obterPrevisoesDiarias(): DiaPrevisao[] {
    if (!this.dadosPrevisao) return [];
    const inicio = this.paginaAtual * this.diasPorPagina;
    const fim = inicio + this.diasPorPagina;
    return this.dadosPrevisao.previsao.diasPrevisao.slice(inicio, fim);
  }

  get totalPaginas(): number {
    if (!this.dadosPrevisao) return 0;
    return Math.ceil(this.dadosPrevisao.previsao.diasPrevisao.length / this.diasPorPagina);
  }

  get podeAvancar(): boolean {
    return this.paginaAtual < this.totalPaginas - 1;
  }

  get podeVoltar(): boolean {
    return this.paginaAtual > 0;
  }

  formatarData(dataString: string): string {
    const partesData = dataString.split('-');
    const data = new Date(
      parseInt(partesData[0]),
      parseInt(partesData[1]) - 1,
      parseInt(partesData[2])
    );

    const hoje = new Date();
    const hojeNormalizada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    const amanha = new Date(hojeNormalizada);
    amanha.setDate(amanha.getDate() + 1);

    if (data.getTime() === hojeNormalizada.getTime()) {
      return 'Hoje';
    } else if (data.getTime() === amanha.getTime()) {
      return 'Amanhã';
    } else {
      return data.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      });
    }
  }

  formatarDiaSemana(dataString: string): string {
    const partesData = dataString.split('-');
    const data = new Date(
      parseInt(partesData[0]),
      parseInt(partesData[1]) - 1,
      parseInt(partesData[2])
    );

    const hoje = new Date();
    const hojeNormalizada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    const amanha = new Date(hojeNormalizada);
    amanha.setDate(amanha.getDate() + 1);

    if (data.getTime() === hojeNormalizada.getTime()) {
      return 'Hoje';
    } else if (data.getTime() === amanha.getTime()) {
      return 'Amanhã';
    } else {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const diaAbreviado = diasSemana[data.getDay()].substring(0, 3).toLowerCase() + '.';
      return diaAbreviado;
    }
  }

  ehHoje(dataString: string): boolean {
    const partesData = dataString.split('-');
    const anoApi = parseInt(partesData[0]);
    const mesApi = parseInt(partesData[1]) - 1;
    const diaApi = parseInt(partesData[2]);

    const dataApi = new Date(anoApi, mesApi, diaApi);

    const hoje = new Date();
    const hojeNormalizada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    return dataApi.getTime() === hojeNormalizada.getTime();
  }

  obterDiaDoMes(dataString: string): number {
    const data = new Date(dataString);
    return data.getDate();
  }

  rolarCarrossel(direcao: number): void {
    if (direcao > 0 && this.podeAvancar) {
      this.paginaAtual++;
    } else if (direcao < 0 && this.podeVoltar) {
      this.paginaAtual--;
    }
  }

  obterChanceChuva(dia: DiaPrevisao): number {
    return dia.dia.diaria_chuva;
  }

  toggleDetalhes(index: number): void {
    if (this.cardAtivoIndex === index) {
      this.cardAtivoIndex = null;
    } else {
      this.cardAtivoIndex = index;
    }
  }

  ehCardAtivo(index: number): boolean {
    return this.cardAtivoIndex === index;
  }

  selecionarDia(index: number): void {
    const indiceGlobal = this.paginaAtual * this.diasPorPagina + index;
    this.servicoDiaSelecionado.selecionarDia(indiceGlobal);
  }

  ehDiaSelecionado(index: number): boolean {
    const indiceGlobal = this.paginaAtual * this.diasPorPagina + index;
    return this.diaSelecionadoGlobal === indiceGlobal;
  }
}
