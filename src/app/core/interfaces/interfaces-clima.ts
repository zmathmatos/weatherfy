// Interfaces de Resposta da WeatherAPI.com
export interface DadosClima {
  localizacao: Localizacao;
  atual: Atual;
}

export interface Localizacao {
  nome: string;
  regiao: string;
  pais: string;
  lat: number;
  lon: number;
  tz_id: string;
  horaLocal: string;
}

export interface Atual {
  temp_c: number;
  temp_f: number;
  is_day: number;
  condicao: Condicao;
  vento_kph: number;
  grau_vento: number;
  pressao_mb: number;
  precip_mm: number;
  umidade: number;
  nuvem: number;
  sensacao_c: number;
  sensacao_f: number;
  vis_km: number;
  uv: number;
  qualidade_ar?: QualidadeAr;
}

export interface Condicao {
  texto: string;
  icone: string;
  codigo: number;
}

export interface QualidadeAr {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number;
  'gb-defra-index': number;
}

export interface DadosPrevisao {
  localizacao: Localizacao;
  atual?: Atual | null;
  previsao: Previsao;
  alertas?: Alerta[];
}

export interface Previsao {
  diasPrevisao: DiaPrevisao[];
}

export interface DiaPrevisao {
  data: string;
  data_epoch: number;
  dia: Dia;
  astro: Astro;
  hora: Hora[];
}

export interface Dia {
  maxTemp_c: number;
  maxTemp_f: number;
  minTemp_c: number;
  minTemp_f: number;
  mediaTemp_c: number;
  maxVento_kph: number;
  totalPrecip_mm: number;
  mediaUmidade: number;
  diaria_chuva: number;
  chance_chuva: number;
  diaria_neve: number;
  chance_neve: number;
  condicao: Condicao;
  uv: number;
}

export interface Astro {
  nascerSol: string;
  porSol: string;
  nascerLua: string;
  porLua: string;
}

export interface Hora {
  tempo: string;
  temp_c: number;
  condicao: Condicao;
  vento_kph: number;
  umidade: number;
  chance_chuva: number;
  chance_neve: number;
  precip_mm: number;
  pressao_mb: number;
  sensacao_c: number;
  vis_km: number;
  uv: number;
  rajada_kph: number;
}

export interface Alerta {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

export interface DadosLocalizacao {
  latitude: number;
  longitude: number;
  cidade?: string;
  pais?: string;
}
