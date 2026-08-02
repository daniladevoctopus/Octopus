export interface IndexEntry {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  category: 'cooking' | 'gaming' | 'tech' | 'education' | 'news' | 'general'
  keywords: string[]
  imageUrl: string
}

export const SEARCH_INDEX: IndexEntry[] = [
  // --- COOKING & RECIPES ---
  {
    id: 'cook-1',
    title: 'Классические сладкие блинчики на молоке — Пошаговый рецепт',
    url: 'https://eda.ru/recepty/выпечка-десерты/тонкие-сладкие-блинчики-на-молоке-14321',
    domain: 'eda.ru',
    snippet: 'Традиционный рецепт тонких ажурных блинчиков с дырочками. Идеальные пропорции молока, яиц, сахара и муки с подробными фото.',
    category: 'cooking',
    keywords: ['блинчики', 'блины', 'сладкие', 'молоко', 'молоке', 'рецепт', 'приготовить', 'выпечка', 'кулинария', 'десерт'],
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cook-2',
    title: 'Пышные блинчики с клубничным соусом и начинкой',
    url: 'https://povarenok.ru/recipes/show/154320/',
    domain: 'povarenok.ru',
    snippet: 'Секреты приготовления нежных сладких блинчиков с сочной клубникой. Как замешать тесто без комочков за 10 минут.',
    category: 'cooking',
    keywords: ['блинчики', 'блины', 'клубника', 'клубникой', 'сладкие', 'начинка', 'соус', 'рецепт', 'приготовить'],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cook-3',
    title: 'Топ-10 рецептов домашних блинчиков на кипятке и молоке',
    url: 'https://gastronom.ru/recipe/group/1230/bliny-i-oladi',
    domain: 'gastronom.ru',
    snippet: 'Лучшие варианты приготовления блинчиков: со сгущенкой, вареньем, ягодами и шоколадной пастой.',
    category: 'cooking',
    keywords: ['блинчики', 'блины', 'топ', 'рецепты', 'молоке', 'кипятке', 'сладкие', 'еда'],
    imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cook-4',
    title: 'Французские крепы и тонкие блинчики с ягодами',
    url: 'https://allrecipes.com/recipe/16383/basic-crepes/',
    domain: 'allrecipes.com',
    snippet: 'Утонченный рецепт французских блинчиков (крепов) с карамелизированными фруктами и сахарной пудрой.',
    category: 'cooking',
    keywords: ['крепы', 'блинчики', 'блины', 'французские', 'сладкие', 'ягоды', 'десерт'],
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cook-5',
    title: 'Сладкие ажурные блинчики на кефире и молоке',
    url: 'https://лайфхакер.рф/pancake-recipes/',
    domain: 'lifehacker.ru',
    snippet: 'Пошаговый разбор ошибки: почему блинчики рвутся или прилипают к сковороде и как сделать их идеальными.',
    category: 'cooking',
    keywords: ['блинчики', 'блины', 'кефир', 'молоко', 'советы', 'лайфхак', 'рецепт'],
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
  },

  // --- GAMING & SOFTWARE ---
  {
    id: 'game-1',
    title: 'Скачать Roblox Player для ПК — Официальный сайт',
    url: 'https://www.roblox.com/download',
    domain: 'roblox.com',
    snippet: 'Загрузите официальный клиент Roblox Player для Windows 10/11 и macOS. Бесплатный доступ к миллионам 3D-миров.',
    category: 'gaming',
    keywords: ['roblox', 'роблокс', 'скачать', 'пк', 'pc', 'официальный', 'сайт', 'игра', 'игры', 'установить'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Roblox_Logo_2022.svg/800px-Roblox_Logo_2022.svg.png',
  },
  {
    id: 'game-2',
    title: 'Как установить Roblox на ПК — Пошаговая инструкция',
    url: 'https://help.roblox.com/hc/ru/articles/203312910-Как-установить-Roblox',
    domain: 'help.roblox.com',
    snippet: 'Официальное руководство по установке Roblox на компьютер. Системные требования, настройки браузера и запуска.',
    category: 'gaming',
    keywords: ['roblox', 'роблокс', 'установить', 'компьютер', 'инструкция', 'руководство', 'помощь', 'пк'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_2022.svg/800px-Roblox_player_icon_2022.svg.png',
  },
  {
    id: 'game-3',
    title: 'Roblox в Google Play — Скачать на Android',
    url: 'https://play.google.com/store/apps/details?id=com.roblox.client',
    domain: 'play.google.com',
    snippet: 'Загружайте мобильную версию Roblox на смартфоны и планшеты Android. Играйте с друзьями по сети на любых устройствах.',
    category: 'gaming',
    keywords: ['roblox', 'роблокс', 'android', 'андроид', 'google', 'play', 'скачать', 'приложение', 'мобильная'],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'game-4',
    title: 'Roblox Studio — Скачать программу для создания игр',
    url: 'https://create.roblox.com/landing',
    domain: 'create.roblox.com',
    snippet: 'Профессиональный бесплатный движок Roblox Studio для создания собственных игр, скриптов на Lua и 3D-моделей.',
    category: 'gaming',
    keywords: ['roblox', 'studio', 'роблокс', 'студио', 'создание', 'игр', 'движок', 'lua', 'разработка'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roblox_Studio_2021_Icon.svg/800px-Roblox_Studio_2021_Icon.svg.png',
  },
  {
    id: 'game-5',
    title: 'Roblox для Windows 10/11 — Microsoft Store',
    url: 'https://apps.microsoft.com/detail/9nblggh2jhxj',
    domain: 'microsoft.com',
    snippet: 'Установите Roblox прямо из магазина приложений Microsoft Store для безопасной игры на ПК.',
    category: 'gaming',
    keywords: ['roblox', 'роблокс', 'windows', 'microsoft', 'store', 'скачать', 'магазин', 'пк'],
    imageUrl: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'game-6',
    title: 'Roblox Wiki — База знаний и руководство игрока',
    url: 'https://roblox.fandom.com/wiki/Roblox_Wiki',
    domain: 'roblox.fandom.com',
    snippet: 'Крупнейшая Википедии по Roblox: гайды, промокоды, секреты карт и описание всех игровых предметов.',
    category: 'gaming',
    keywords: ['roblox', 'роблокс', 'wiki', 'вики', 'гайды', 'промокоды', 'секреты', 'база'],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
  },

  // --- TECH & DEVELOPER ---
  {
    id: 'tech-1',
    title: 'React 19 — Официальный релиз и новые возможности',
    url: 'https://react.dev/blog/2024/04/25/react-19',
    domain: 'react.dev',
    snippet: 'Полный разбор React 19: Server Actions, useActionState, useOptimistic, автоматическая мемоизация в React Compiler.',
    category: 'tech',
    keywords: ['react', '19', 'реакт', 'нового', 'обновление', 'frontend', 'javascript', 'веб', 'разработка'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/800px-React-icon.svg.png',
  },
  {
    id: 'tech-2',
    title: 'TanStack Start — Полная документация фреймворка',
    url: 'https://tanstack.com/start/latest',
    domain: 'tanstack.com',
    snippet: 'Документация TanStack Start: фуллстек фреймворк на базе TanStack Router, SSR, Server Functions и Vite.',
    category: 'tech',
    keywords: ['tanstack', 'start', 'router', 'документация', 'фреймворк', 'ssr', 'vite', 'typescript'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tech-3',
    title: 'Что нового в React 19 — Подробный разбор на Хабре',
    url: 'https://habr.com/ru/articles/809124/',
    domain: 'habr.com',
    snippet: 'Практические примеры использования хуков use(), поддержки асинхронных переходов и директивы use server.',
    category: 'tech',
    keywords: ['react', '19', 'хабр', 'habr', 'нового', 'разбор', 'примеры', 'код'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },

  // --- EDUCATION & GENERAL ---
  {
    id: 'edu-1',
    title: 'Википедия — Свободная энциклопедия',
    url: 'https://ru.wikipedia.org/',
    domain: 'wikipedia.org',
    snippet: 'Мировая база знаний: миллионы статей по науке, истории, технологиям и культуре с проверенными источниками.',
    category: 'education',
    keywords: ['википедия', 'wikipedia', 'энциклопедия', 'статьи', 'наука', 'история', 'факты'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
  },
]
