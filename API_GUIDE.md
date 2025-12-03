# 🌐 Informações da API OpenWeatherMap

## Como Obter sua API Key GRATUITA

### Passo 1: Criar Conta

1. Acesse: https://openweathermap.org/
2. Clique em "Sign In" → "Create an Account"
3. Preencha:
   - Username (nome de usuário)
   - Email
   - Password (senha)
4. Aceite os termos e clique em "Create Account"

### Passo 2: Confirmar Email

1. Verifique sua caixa de entrada
2. Abra o email de confirmação
3. Clique no link de verificação

### Passo 3: Acessar API Keys

1. Faça login em: https://home.openweathermap.org/
2. Vá para "API keys" no menu
3. Você verá uma chave padrão já criada
4. Copie a chave (formato: 32 caracteres alfanuméricos)

### Passo 4: Aguardar Ativação

⚠️ **IMPORTANTE**: Novas API Keys podem levar até 2 horas para serem ativadas!

- Se receber erro "Invalid API Key", aguarde um pouco
- Tente novamente após 10-30 minutos

## Planos Disponíveis

### Free Plan (Gratuito) ✅

**Usado neste projeto**

- ✅ 1.000 chamadas por dia
- ✅ 60 chamadas por minuto
- ✅ Dados atuais do clima
- ✅ Previsão de 5 dias
- ✅ Dados horários
- ❌ Sem histórico
- ❌ Sem dados avançados

**Perfeito para:**

- Projetos pessoais
- Aprendizado
- Portfólio
- Aplicações pequenas

### Startup Plan ($40/mês)

- 100.000 chamadas por dia
- Dados históricos
- Suporte por email

### Developer Plan ($180/mês)

- 1.000.000 chamadas por dia
- Todas as funcionalidades
- Suporte prioritário

## Endpoints Utilizados no Projeto

### 1. Current Weather Data

```
GET https://api.openweathermap.org/data/2.5/weather
```

**Parâmetros:**

- `q={city name},{country code}` - Nome da cidade
- `lat={lat}&lon={lon}` - Coordenadas
- `appid={API key}` - Sua chave API
- `units=metric` - Sistema métrico (Celsius)
- `lang=pt_br` - Idioma português

**Exemplo de Request:**

```
https://api.openweathermap.org/data/2.5/weather?q=São Paulo,BR&appid=SUA_CHAVE&units=metric&lang=pt_br
```

**Exemplo de Response:**

```json
{
  "coord": { "lon": -46.6361, "lat": -23.5475 },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "céu limpo",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 25.5,
    "feels_like": 25.8,
    "temp_min": 23.2,
    "temp_max": 28.1,
    "pressure": 1013,
    "humidity": 65
  },
  "wind": {
    "speed": 3.5,
    "deg": 180
  },
  "name": "São Paulo",
  "sys": {
    "country": "BR",
    "sunrise": 1638345600,
    "sunset": 1638393600
  }
}
```

### 2. 5 Day / 3 Hour Forecast

```
GET https://api.openweathermap.org/data/2.5/forecast
```

**Parâmetros:** (mesmos do endpoint anterior)

**Exemplo de Response:**

```json
{
  "list": [
    {
      "dt": 1638374400,
      "main": {
        "temp": 24.5,
        "temp_min": 23.2,
        "temp_max": 26.1
      },
      "weather": [
        {
          "main": "Rain",
          "description": "chuva leve"
        }
      ],
      "pop": 0.85,
      "dt_txt": "2025-12-02 12:00:00"
    }
  ]
}
```

## Códigos de Status HTTP

### Sucesso

- `200 OK` - Requisição bem-sucedida

### Erros do Cliente

- `400 Bad Request` - Parâmetros inválidos
- `401 Unauthorized` - API Key inválida ou ausente
- `404 Not Found` - Cidade não encontrada
- `429 Too Many Requests` - Limite de requisições excedido

### Erros do Servidor

- `500 Internal Server Error` - Erro no servidor da API
- `502 Bad Gateway` - Servidor temporariamente indisponível
- `503 Service Unavailable` - Serviço em manutenção

## Limites e Restrições

### Frequência de Atualização

- Dados do clima: atualizados a cada 10 minutos
- Não faz sentido fazer requisições mais frequentes

### Rate Limiting

- **Free Plan**: 60 chamadas/minuto
- Se exceder: erro 429
- Aguarde 1 minuto antes de tentar novamente

### Precisão dos Dados

- Temperatura: ±1°C
- Umidade: ±5%
- Vento: ±0.5 m/s
- Dados podem variar conforme estação meteorológica

## Ícones do Clima

Os ícones são retornados no formato: `01d`, `02n`, etc.

**Formato da URL:**

```
https://openweathermap.org/img/wn/{icon_code}@2x.png
```

**Exemplos:**

- `01d` = ☀️ Céu limpo (dia)
- `01n` = 🌙 Céu limpo (noite)
- `02d` = ⛅ Parcialmente nublado
- `03d` = ☁️ Nublado
- `09d` = 🌧️ Chuva
- `10d` = 🌦️ Chuva leve
- `11d` = ⛈️ Trovoada
- `13d` = ❄️ Neve
- `50d` = 🌫️ Névoa

## Idiomas Suportados

O projeto usa `lang=pt_br` para português brasileiro.

**Outros idiomas disponíveis:**

- `pt_br` - Português (Brasil)
- `en` - Inglês
- `es` - Espanhol
- `fr` - Francês
- `de` - Alemão
- `it` - Italiano
- `ja` - Japonês
- `zh_cn` - Chinês

## Dicas e Boas Práticas

### ✅ Faça

- Cache respostas por alguns minutos
- Trate erros adequadamente
- Use HTTPS
- Implemente retry com backoff
- Monitore uso da API

### ❌ Não Faça

- Compartilhar sua API Key publicamente
- Fazer requisições desnecessárias
- Ignorar rate limits
- Fazer deploy com chave no código

## Segurança da API Key

### ⚠️ NUNCA:

- Comite a chave no Git
- Compartilhe em fóruns públicos
- Deixe no código-fonte exposto
- Use em aplicações sem backend

### ✅ SEMPRE:

- Use variáveis de ambiente
- Adicione `.env` no `.gitignore`
- Regenere se exposta
- Use proxy backend em produção

## Alternativas à OpenWeatherMap

Se precisar de mais recursos ou dados diferentes:

- **WeatherAPI.com** - 1M chamadas grátis/mês
- **Visual Crossing** - 1000 chamadas/dia grátis
- **AccuWeather** - Dados detalhados (pago)
- **Tomorrow.io** - API moderna (free tier limitado)

## Suporte

### Documentação Oficial

- https://openweathermap.org/api
- https://openweathermap.org/current
- https://openweathermap.org/forecast5

### Comunidade

- Stack Overflow: [openweathermap tag]
- Fórum oficial: https://openweathermap.org/community

### Suporte Técnico

- Email: info@openweathermap.org
- FAQ: https://openweathermap.org/faq

---

**Dica Final**: Guarde sua API Key em um local seguro! Você pode regenerá-la a qualquer momento no painel de controle.
