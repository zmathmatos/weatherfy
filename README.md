# 🌤️ Weatherfy - Aplicativo de Clima em Tempo Real

Aplicativo completo de clima/tempo desenvolvido em **Angular 20** com arquitetura limpa, design responsivo, animações modernas e interface totalmente em português brasileiro.

## ✨ Funcionalidades

- 🌍 **Detecção automática de localização** - Use sua localização atual para ver o clima local
- 🔍 **Busca por cidade** - Pesquise o clima de qualquer cidade do mundo
- 🌡️ **Informações completas do clima**:
  - Temperatura atual e sensação térmica
  - Temperatura mínima e máxima
  - Umidade do ar
  - Velocidade do vento
  - Pressão atmosférica
  - Horário do nascer e pôr do sol
  - Índice UV e nível de conforto
  - Qualidade do ar (PM2.5, PM10, CO, NO₂, SO₂, O₃)
- 🌧️ **Chance de chuva** - Probabilidade de precipitação
- 📅 **Previsão de 5 dias** - Acompanhe o clima dos próximos dias
- 📊 **Gráficos interativos** - Visualização de temperatura e chance de chuva por hora
- 🌓 **Informações astronômicas** - Horários do nascer/pôr do sol e lua
- 📱 **Design responsivo** - Interface adaptável para todos os dispositivos
- 🎨 **Animações modernas** - Transições suaves e visuais atraentes
- 🏗️ **Arquitetura limpa** - Código organizado e manutenível
- 🌐 **Interface em português** - Totalmente traduzida para português brasileiro

## 🛠️ Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **Angular Material** - Componentes UI modernos
- **RxJS** - Programação reativa
- **WeatherAPI.com** - Dados meteorológicos em tempo real
- **Geolocation API** - Detecção de localização do navegador
- **Chart.js + ng2-charts** - Gráficos interativos
- **SCSS** - Estilos avançados
- **TypeScript** - Tipagem estática

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Como Instalar e Executar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure a chave da API do WeatherAPI.com

1. Acesse [WeatherAPI.com](https://www.weatherapi.com/signup.aspx) e crie uma conta gratuita
2. Gere uma API Key gratuita (até 1 milhão de chamadas por mês)
3. Abra o arquivo `src/environments/environment.ts`
4. Substitua `'SUA_CHAVE_API_AQUI'` pela sua chave API:

```typescript
export const environment = {
  production: false,
  weatherApiKey: 'SUA_CHAVE_API_AQUI',
  weatherApiUrl: 'https://api.weatherapi.com/v1',
};
```

5. Faça o mesmo no arquivo `src/environments/environment.prod.ts`

### 3. Execute o aplicativo

```bash
ng serve
```

O aplicativo estará disponível em `http://localhost:4200`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                      # Módulo core - Serviços e modelos fundamentais
│   │   ├── services/              # Serviços da aplicação
│   │   │   ├── servico-clima.ts         # Serviço de API do clima
│   │   │   └── servico-geolocalizacao.ts # Serviço de geolocalização
│   │   └── interfaces/            # Interfaces TypeScript
│   │       └── interfaces-clima.ts      # Tipagens dos dados do clima
│   │
│   ├── shared/                    # Componentes compartilhados
│   │   └── components/
│   │       └── busca-localizacao/ # Componente de busca de localização
│   │
│   ├── features/                  # Features da aplicação
│   │   └── weather/               # Feature principal do clima
│   │       ├── clima-component.ts # Componente principal do clima
│   │       └── components/
│   │           ├── clima-atual/         # Componente do clima atual
│   │           ├── previsao-clima/      # Componente de previsão diária
│   │           ├── previsao-horaria/    # Componente de previsão horária
│   │           └── detalhes-clima/      # Componente de detalhes e análises
│   │
│   ├── app.config.ts              # Configuração da aplicação
│   ├── app.routes.ts              # Rotas da aplicação
│   └── app.ts                     # Componente raiz
│
├── environments/                  # Configurações de ambiente
│   ├── environment.ts             # Ambiente de desenvolvimento
│   └── environment.prod.ts        # Ambiente de produção
│
└── styles.scss                    # Estilos globais
```

## 🎯 Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**:

- **Core**: Contém a lógica de negócio e serviços independentes
- **Shared**: Componentes reutilizáveis em toda a aplicação
- **Features**: Módulos de funcionalidades específicas
- **Separation of Concerns**: Cada camada tem sua responsabilidade bem definida
- **Dependency Injection**: Injeção de dependências do Angular
- **Reactive Programming**: Uso de Observables (RxJS)

## 🌐 API Utilizada

### WeatherAPI.com

- **Current Weather**: Dados do clima atual
- **5 Day Forecast**: Previsão para os próximos 5 dias com dados horários
- **Astronomy**: Informações astronômicas (nascer/pôr do sol e lua)
- **Air Quality**: Índices de qualidade do ar
- **Documentação**: [WeatherAPI Docs](https://www.weatherapi.com/docs/)
- **Preço**: Gratuito (1 milhão de chamadas/mês)

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona perfeitamente em:

- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 📍 Sobre o Projeto

Este é um projeto independente desenvolvido para fins educacionais e de demonstração. O código segue as melhores práticas de desenvolvimento com Angular.

### Características Técnicas

- ✅ **Tipagem Forte**: TypeScript com interfaces bem definidas
- ✅ **Arquitetura Modular**: Separação clara de responsabilidades
- ✅ **Performance Otimizada**: Build de produção eficiente

## 🔐 Permissões Necessárias

O aplicativo solicita permissão para acessar sua localização geográfica. Esta permissão é **opcional**.

## 🚀 Build de Produção

Para criar uma build otimizada para produção:

```bash
ng build
```

Os arquivos serão gerados na pasta `dist/weatherfy/browser/`

## 🧪 Testes

### Executar testes unitários

```bash
ng test
```

### Executar testes e2e

```bash
ng e2e
```

---

**Desenvolvido com Angular 20** 🅰️

Aproveite o Weatherfy! 🌤️
