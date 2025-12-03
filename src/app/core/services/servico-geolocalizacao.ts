import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { DadosLocalizacao } from '../interfaces/interfaces-clima';

@Injectable({
  providedIn: 'root',
})
export class ServicoGeolocalizacao {
  constructor() {}

  /**
   * Obtém a localização atual do usuário usando a API de Geolocalização do navegador
   */
  obterLocalizacaoAtual(): Observable<DadosLocalizacao> {
    return new Observable((observer: Observer<DadosLocalizacao>) => {
      if (!navigator.geolocation) {
        observer.error('Geolocalização não suportada pelo navegador');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const dadosLocalizacao: DadosLocalizacao = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          observer.next(dadosLocalizacao);
          observer.complete();
        },
        (error: GeolocationPositionError) => {
          let mensagemErro = 'Erro ao obter localização';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              mensagemErro = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              mensagemErro = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              mensagemErro = 'Tempo esgotado ao buscar localização';
              break;
          }
          observer.error(mensagemErro);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Verifica se a geolocalização está disponível
   */
  geolocalizacaoDisponivel(): boolean {
    return 'geolocation' in navigator;
  }
}
