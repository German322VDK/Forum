# Forum

## Описание проекта
Forum — это проект, который включает в себя API на ASP.NET Core, клиентскую часть на React JS, сервер Nginx и контейнеризацию с помощью Docker. Проект предоставляет функциональность для управления форумом, включая создание и взаимодействие с постами, комментариями и темами обсуждения. 
## Используемые технологии: 
**SQLite, JWT Bearer, Serilog, XUnit, Swagger**.

## Структура проекта
```
Forum
├── Forum.Database
│   ├── Context
│   └── Migrations
├── Forum.Domain
│   ├── Entities
│   │   ├── ForumEntities
│   │   │   └── Likes
│   │   └── Identity
│   └── ViewModels
│       ├── Contents
│       │   ├── Base
│       │   └── FromView
│       └── Identities
├── Forum.Infrastructure
│   ├── Initializers
│   ├── Mapping
│   ├── Services
│   │   ├── Stores
│   │   └── Identity
│   └── StaticData
├── Forum.Server
│   ├── Controllers
│   └── WebInfrastructure
│       ├── FileManagement
│       ├── Middlewares
│       └── Security
└── wwwroot
```


## Установка и запуск
1. Убедитесь, что у вас установлены [Docker](https://www.docker.com/get-started) и [Docker Compose](https://docs.docker.com/compose/).
2. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/German322VDK/Forum.git
   cd Forum
3. Соберите и запустите проект с помощью Docker Compose:
   ```bash
   docker-compose up --build

## Конфигурация
### Server launchSettings.json
`launchSettings.json` содержит профили для запуска приложения. Основные настройки включают:
- **http**: Запускает приложение на `http://localhost:5171` и открывает Swagger при старте.
- **IIS Express**: Аналогично, но запускается с помощью IIS Express.
- **Container (Dockerfile)**: Запускает приложение в контейнере Docker, открывая Swagger по адресу `{Scheme}://{ServiceHost}:{ServicePort}/swagger`.

### Dockerfile'ы
- **Server.DockerFile**: Используется для сборки и публикации серверной части на ASP.NET Core.
- **client.DockerFile**: Содержит инструкции для сборки клиентской части на React.
- **Nginx.DockerFile**: Использует официальный образ Nginx и копирует конфигурационный файл.

### docker-compose.yml
Файл `docker-compose.yml` описывает сервисы приложения:
- **backend**: API на ASP.NET Core, **внешний порт** `5000`, **внутренний порт** `8080`.
- **client**: Клиентская часть на React, **внешний порт** `5001`, **внутренний порт** `3000`.
- **proxy**: Сервер Nginx для маршрутизации запросов, **внешний порт** `8080`, **внутренний порт** `8080`.


### URLs
В клиенте (в файле `forum-client-app/src/urls.js`) задается базовый URL для взаимодействия с сервером:
- Порт `5171` используется, если сервер не запущен в Docker.
- Порт `8080` используется, если сервер запущен с помощью Docker Compose.

Для корректной работы необходимо установить соответствующий порт:
```javascript
//const baseUrl = `http://localhost:5171/`;
const baseUrl = `http://localhost:8080/`;


## Тестирование
Проект включает в себя модульные тесты для CommentStore, PostStore и TradStore. Чтобы запустить тесты, используйте GitHub Actions или выполните тесты локально с помощью следующей команды:
 ```bash
  dotnet test
 ```
[![Testing](https://github.com/German322VDK/Forum/actions/workflows/testing.yml/badge.svg)](https://github.com/German322VDK/Forum/actions/workflows/testing.yml)

## Документация
Чтобы ознакомится с документацией перейдите по [ссылке](https://german322vdk.github.io/Forum/api/index.html)
