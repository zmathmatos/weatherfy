import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DadosClima, DadosPrevisao } from '../interfaces/interfaces-clima';

@Injectable({
  providedIn: 'root',
})
export class ServicoClima {
  private urlApi = environment.weatherApiUrl;
  private chaveApi = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Obtém dados do clima atual por coordenadas geográficas
   */
  obterClimaAtualPorCoordenadas(lat: number, lon: number): Observable<DadosClima> {
    const params = new HttpParams()
      .set('key', this.chaveApi)
      .set('q', `${lat},${lon}`)
      .set('lang', 'pt')
      .set('aqi', 'yes');

    return this.http
      .get<any>(`${this.urlApi}/current.json`, { params })
      .pipe(map(this.mapearDadosClima), catchError(this.tratarErro));
  }

  /**
   * Obtém dados do clima atual por nome da cidade
   */
  obterClimaAtualPorCidade(cidade: string): Observable<DadosClima> {
    const params = new HttpParams()
      .set('key', this.chaveApi)
      .set('q', cidade)
      .set('lang', 'pt')
      .set('aqi', 'yes');

    return this.http
      .get<any>(`${this.urlApi}/current.json`, { params })
      .pipe(map(this.mapearDadosClima), catchError(this.tratarErro));
  }

  /**
   * Obtém previsão do tempo para os próximos dias
   */
  obterPrevisaoPorCoordenadas(lat: number, lon: number): Observable<DadosPrevisao> {
    const params = new HttpParams()
      .set('key', this.chaveApi)
      .set('q', `${lat},${lon}`)
      .set('days', '14')
      .set('lang', 'pt')
      .set('aqi', 'yes');

    return this.http
      .get<any>(`${this.urlApi}/forecast.json`, { params })
      .pipe(map(this.mapearDadosPrevisao), catchError(this.tratarErro));
  }

  /**
   * Obtém histórico do tempo por coordenadas
   */
  obterHistoricoPorCoordenadas(lat: number, lon: number, data: string): Observable<DadosPrevisao> {
    const params = new HttpParams()
      .set('key', this.chaveApi)
      .set('q', `${lat},${lon}`)
      .set('dt', data)
      .set('lang', 'pt');

    return this.http
      .get<any>(`${this.urlApi}/history.json`, { params })
      .pipe(map(this.mapearDadosHistorico), catchError(this.tratarErro));
  }

  /**
   * Obtém histórico do tempo por cidade
   */
  obterHistoricoPorCidade(cidade: string, data: string): Observable<DadosPrevisao> {
    const params = new HttpParams()
      .set('key', this.chaveApi)
      .set('q', cidade)
      .set('dt', data)
      .set('lang', 'pt');

    return this.http
      .get<any>(`${this.urlApi}/history.json`, { params })
      .pipe(map(this.mapearDadosHistorico), catchError(this.tratarErro));
  }

  /**
   * Retorna URL completa do ícone do clima em alta resolução
   */
  obterUrlIconeClima(caminhoIcone: string): string {
    const urlBase = caminhoIcone.startsWith('//') ? `https:${caminhoIcone}` : caminhoIcone;
    return urlBase.replace('/64x64/', '/128x128/');
  }

  /**
   * Mapeia os dados da API para DadosClima
   */
  private mapearDadosClima(dados: any): DadosClima {
    return {
      localizacao: {
        nome: dados.location.name,
        regiao: dados.location.region,
        pais: dados.location.country,
        lat: dados.location.lat,
        lon: dados.location.lon,
        tz_id: dados.location.tz_id,
        horaLocal: dados.location.localtime,
      },
      atual: {
        temp_c: dados.current.temp_c,
        temp_f: dados.current.temp_f,
        is_day: dados.current.is_day,
        condicao: {
          texto: dados.current.condition.text,
          icone: dados.current.condition.icon,
          codigo: dados.current.condition.code,
        },
        vento_kph: dados.current.wind_kph,
        grau_vento: dados.current.wind_degree,
        pressao_mb: dados.current.pressure_mb,
        precip_mm: dados.current.precip_mm,
        umidade: dados.current.humidity,
        nuvem: dados.current.cloud,
        sensacao_c: dados.current.feelslike_c,
        sensacao_f: dados.current.feelslike_f,
        vis_km: dados.current.vis_km,
        uv: dados.current.uv,
        qualidade_ar: dados.current.air_quality,
      },
    };
  }

  /**
   * Mapeia os dados da API para DadosPrevisao
   */
  private mapearDadosPrevisao(dados: any): DadosPrevisao {
    return {
      localizacao: {
        nome: dados.location.name,
        regiao: dados.location.region,
        pais: dados.location.country,
        lat: dados.location.lat,
        lon: dados.location.lon,
        tz_id: dados.location.tz_id,
        horaLocal: dados.location.localtime,
      },
      atual: {
        temp_c: dados.current.temp_c,
        temp_f: dados.current.temp_f,
        is_day: dados.current.is_day,
        condicao: {
          texto: dados.current.condition.text,
          icone: dados.current.condition.icon,
          codigo: dados.current.condition.code,
        },
        vento_kph: dados.current.wind_kph,
        grau_vento: dados.current.wind_degree,
        pressao_mb: dados.current.pressure_mb,
        precip_mm: dados.current.precip_mm,
        umidade: dados.current.humidity,
        nuvem: dados.current.cloud,
        sensacao_c: dados.current.feelslike_c,
        sensacao_f: dados.current.feelslike_f,
        vis_km: dados.current.vis_km,
        uv: dados.current.uv,
        qualidade_ar: dados.current.air_quality,
      },
      previsao: {
        diasPrevisao: dados.forecast.forecastday.map((dia: any) => ({
          data: dia.date,
          data_epoch: dia.date_epoch,
          dia: {
            maxTemp_c: dia.day.maxtemp_c,
            maxTemp_f: dia.day.maxtemp_f,
            minTemp_c: dia.day.mintemp_c,
            minTemp_f: dia.day.mintemp_f,
            mediaTemp_c: dia.day.avgtemp_c,
            maxVento_kph: dia.day.maxwind_kph,
            totalPrecip_mm: dia.day.totalprecip_mm,
            mediaUmidade: dia.day.avghumidity,
            diaria_chuva: dia.day.daily_will_it_rain,
            chance_chuva: dia.day.daily_chance_of_rain,
            diaria_neve: dia.day.daily_will_it_snow,
            chance_neve: dia.day.daily_chance_of_snow,
            condicao: {
              texto: dia.day.condition.text,
              icone: dia.day.condition.icon,
              codigo: dia.day.condition.code,
            },
            uv: dia.day.uv,
          },
          astro: {
            nascerSol: dia.astro.sunrise,
            porSol: dia.astro.sunset,
            nascerLua: dia.astro.moonrise,
            porLua: dia.astro.moonset,
          },
          hora: dia.hour.map((h: any) => ({
            tempo: h.time,
            temp_c: h.temp_c,
            condicao: {
              texto: h.condition.text,
              icone: h.condition.icon,
              codigo: h.condition.code,
            },
            vento_kph: h.wind_kph,
            umidade: h.humidity,
            chance_chuva: h.chance_of_rain,
            chance_neve: h.chance_of_snow,
            precip_mm: h.precip_mm,
            pressao_mb: h.pressure_mb,
            sensacao_c: h.feelslike_c,
            vis_km: h.vis_km,
            uv: h.uv,
            rajada_kph: h.gust_kph,
          })),
        })),
      },
      alertas: dados.alerts?.alert || [],
    };
  }

  /**
   * Mapeia os dados históricos da API
   */
  private mapearDadosHistorico(dados: any): DadosPrevisao {
    return {
      localizacao: {
        nome: dados.location.name,
        regiao: dados.location.region,
        pais: dados.location.country,
        lat: dados.location.lat,
        lon: dados.location.lon,
        tz_id: dados.location.tz_id,
        horaLocal: dados.location.localtime,
      },
      atual: null,
      previsao: {
        diasPrevisao: dados.forecast.forecastday.map((dia: any) => ({
          data: dia.date,
          data_epoch: dia.date_epoch,
          dia: {
            maxTemp_c: dia.day.maxtemp_c,
            maxTemp_f: dia.day.maxtemp_f,
            minTemp_c: dia.day.mintemp_c,
            minTemp_f: dia.day.mintemp_f,
            mediaTemp_c: dia.day.avgtemp_c,
            maxVento_kph: dia.day.maxwind_kph,
            totalPrecip_mm: dia.day.totalprecip_mm,
            mediaUmidade: dia.day.avghumidity,
            diaria_chuva: dia.day.daily_will_it_rain,
            chance_chuva: dia.day.daily_chance_of_rain,
            diaria_neve: dia.day.daily_will_it_snow,
            chance_neve: dia.day.daily_chance_of_snow,
            condicao: {
              texto: dia.day.condition.text,
              icone: dia.day.condition.icon,
              codigo: dia.day.condition.code,
            },
            uv: dia.day.uv,
          },
          astro: {
            nascerSol: dia.astro.sunrise,
            porSol: dia.astro.sunset,
            nascerLua: dia.astro.moonrise,
            porLua: dia.astro.moonset,
          },
          hora: dia.hour.map((h: any) => ({
            tempo: h.time,
            temp_c: h.temp_c,
            condicao: {
              texto: h.condition.text,
              icone: h.condition.icon,
              codigo: h.condition.code,
            },
            vento_kph: h.wind_kph,
            umidade: h.humidity,
            chance_chuva: h.chance_of_rain,
            chance_neve: h.chance_of_snow,
            precip_mm: h.precip_mm,
            pressao_mb: h.pressure_mb,
            sensacao_c: h.feelslike_c,
            vis_km: h.vis_km,
            uv: h.uv,
            rajada_kph: h.gust_kph,
          })),
        })),
      },
      alertas: [],
    };
  }

  private tratarErro(erro: any): Observable<never> {
    let mensagemErro = 'Erro ao buscar dados do clima';

    if (erro.error instanceof ErrorEvent) {
      mensagemErro = `Erro: ${erro.error.message}`;
    } else {
      if (erro.status === 400) {
        mensagemErro = 'Localização não encontrada';
      } else if (erro.status === 401 || erro.status === 403) {
        mensagemErro =
          'Chave de API inválida. Obtenha sua chave gratuita em weatherapi.com/signup.aspx e configure em src/environments/environment.ts';
      } else if (erro.status === 429) {
        mensagemErro = 'Limite de requisições excedido';
      } else {
        mensagemErro = `Erro ${erro.status}: ${erro.message}`;
      }
    }

    return throwError(() => new Error(mensagemErro));
  }
}
