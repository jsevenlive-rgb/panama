import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const experiences: { company: string; position: string }[] = [
  {
    company: 'Сенлер',
    position:
      'fullstack / backend, март 2020 — апрель 2026. Сенлер и StreamVi, senler.ru. Платформа автоматизации маркетинга и ботов для VK и других каналов. Зоны ответственности: интеграции, вебхуки, OAuth, микросервисы, админка. Ключевые технологии за период: Node.js, Go, NestJS, React, PHP, MongoDB, MySQL, Redis, RabbitMQ, Temporal, OAuth2, Docker, Swagger.',
  },
  {
    company: 'Сенлер',
    position:
      'AI-интеграции, 2023–2025. Стек: Node.js, React, OpenAI API, OpenRouter, ProxyAPI, Assistant API. Разработал интеграцию с нейросетями: чат, генерация изображений, Assistant API. Построил backend-движок обработки запросов (Node.js, RabbitMQ, MongoDB) с ожиданием HTTP-ответа от интеграции и продолжением сценария бота. Расширил список провайдеров: OpenAI, OpenRouter, ProxyAPI. Доработал frontend: UI для chat/image/assistant-сценариев.',
  },
  {
    company: 'Сенлер',
    position:
      'Вебхуки, миграция на Go + Temporal, 2023–2024. Стек: Go, Temporal, Node.js, RabbitMQ, Redis, Kubernetes, Docker. Переписал сервис отправки и обработки вебхуков (VK callback и др.) с Node.js + RabbitMQ на Go + Temporal. Двухэтапный pipeline: подготовка и шаблонизация данных, затем отправка, обработка ответа и логирование. Масштабирование: отдельные очереди на личный кабинет и webhook_id (TTL 2 дня), round-robin между инстансами, позже единая очередь с автоскейлом консьюмеров. В 2020–2022 сделал первую версию сервиса на Node.js из PHP-монолита, конструктор шаблонов ответа вебхука (Tree.js), retry через RabbitMQ Exchange и delayed plugin.',
  },
  {
    company: 'Сенлер',
    position:
      'Интеграции и конструктор ботов, 2020–2023. Стек: Node.js, PHP, MongoDB, MySQL, Redis, jQuery, JavaScript. Раздел «Интеграции»: админка, каталог, новый тип шага в конструкторе ботов и движок выполнения. OAuth2-сервер для senler.ru и протокол обмена между интеграцией и ботом (request/response/callback, postMessage). Google Sheets: OAuth через Google, переключение аккаунтов, редактор шага, backend с учётом лимитов API, буфер лидов в Redis, пакетная запись до 1000 строк, столбец уникальности через формулы, чтение из таблицы в переменные Сенлера. Telegram: отправка сообщений от бота Сенлера с подстановкой переменных подписчика. Рекурсивное копирование бота со связанными сущностями, преобразование цепочки рассылки в бота, массовые операции через process manager.',
  },
  {
    company: 'Сенлер',
    position:
      'Ядро платформы и биллинг, 2020–2021. Стек: Node.js, PHP, MongoDB, MySQL, Redis, Kubernetes, Docker. Карточка подписчика: иерархическое дерево UTM-меток. Редактор ботов: «путь бота», глобальные переменные. Микросервис актов и автоподтверждения платежей юрлиц, сервис списаний и уведомлений об окончании тарифа. Новая статистика лидов, нажатий и переходов в редакторе бота.',
  },
  {
    company: 'StreamVi',
    position:
      'Стриминговый сервис, 2024–2025. Стек: NestJS, React, Go, Node.js, OAuth2, Swagger, Apidog. Backend на NestJS, frontend на React, отдельные микросервисы на Go и Node.js. Микросервис вебхуков и раздел интеграций: админка, каталог, обработка webhook-событий. OAuth2-сервер на официальной библиотеке для авторизации сторонних интеграций. Автогенерация API-документации: NestJS, Swagger, Apidog.',
  },
  {
    company: 'StreamVi',
    position:
      'Монетизация и рекламный кабинет, 2026. Стек: NestJS, React, Go, Node.js. Рекламный кабинет и кабинет монетизации стримингового сервиса. Backend-часть продукта в связке с существующей микросервисной архитектурой.',
  },
  {
    company: 'Геликон',
    position:
      'Backend-программист, февраль 2017 — октябрь 2019, helicon-prom.ru. CMS интернет-магазинов: поддомены и гео-шаблонизатор, интеграция с CRM, логика вёрстки (сортировка, фильтры, корзина), SEO-чеклист. Около 1300 магазинов, в том числе ufa.gradushaus.ru, kirov.koptilka.com, samogon-optom.ru. Сервис управления лендингами, модуль поддоменов, автоматизация API Яндекса и Google для индексации, модуль офлайн-магазинов и оптимизации картинок. Подмена контента на лендингах по параметрам. Сайт kirov.trubogib-udachniy.ru и ещё 54 сайта, на 2019 год около 8 млн трафика в месяц.',
  },
  {
    company: 'Фриланс',
    position:
      'Web-разработчик, июнь 2016 — июль 2016. Сайт от-отца-к-сыну.рф на Yii2 и MaterializeCSS: backend и frontend.',
  },
  {
    company: 'Фриланс',
    position:
      'Fullstack-разработчик, июнь 2015 — октябрь 2015. Сайт novaferm.ru на Yii2 и Bootstrap 3: backend и frontend, маркетинг.',
  },
  {
    company: 'Дома Степанова',
    position:
      'Fullstack-разработчик, январь 2011 — сентябрь 2012. Корпоративная часть сайта на Yii. ERP по строительству: хранение проектов и контрагентов, конструктор заявок на строительство.',
  },
];

async function main() {
  const now = new Date();

  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.create({
    data: {
      name: 'Трушков Олег Александрович',
      description:
        'Backend-разработчик. Опыт 11 лет 3 месяца: Сенлер и StreamVi (интеграции, вебхуки, OAuth, микросервисы, боты, биллинг, рекламный кабинет), Геликон, фриланс. Стек: Node.js, Go, NestJS, React, PHP, MongoDB, MySQL, Redis, RabbitMQ, Temporal, Docker.',
      dateCreate: now,
      dateUpdate: now,
      skills: {
        create: [
          'PHP',
          'MongoDB',
          'MySQL',
          'JavaScript',
          'HTML',
          'Nginx',
          'Redis',
          'Node.js',
          'Go',
          'NestJS',
          'React',
          'RabbitMQ',
          'Temporal',
          'OAuth2',
          'Docker',
          'Swagger',
        ].map((name) => ({ name, dateCreate: now, dateUpdate: now })),
      },
      experiences: {
        create: experiences.map((item) => ({
          company: item.company,
          position: item.position,
          dateCreate: now,
          dateUpdate: now,
        })),
      },
      projects: {
        create: [
          { name: 'Сенлер', git: '' },
          { name: 'StreamVi', git: '' },
          { name: 'Геликон CMS', git: '' },
          { name: 'trendradar', git: 'https://github.com/jsevenlive-rgb/trendradar' },
          { name: 'iibaza', git: '' },
        ].map((project) => ({
          name: project.name,
          git: project.git,
          dateCreate: now,
          dateUpdate: now,
        })),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
