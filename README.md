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

## Тестирование
Проект включает в себя модульные тесты для CommentStore, PostStore и TradStore. Чтобы запустить тесты, используйте GitHub Actions или выполните тесты локально с помощью следующей команды:
 ```bash
  dotnet test
 ```
<!-- [![Testing](https://github.com/German322VDK/Forum/actions/workflows/Testing.yml/badge.svg)](https://github.com/German322VDK/Forum/actions/workflows/Testing.yml)-->

## Документация
<!-- Чтобы ознакомится с документацией перейдите по [ссылке](https://german322vdk.github.io/Forum/api/index.html)-->
