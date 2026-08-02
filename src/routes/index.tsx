import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowRight,
  Asterisk,
  Bot,
  Boxes,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Cloud,
  Code2,
  Compass,
  Cookie,
  Download,
  ExternalLink,
  Globe,
  Globe2,
  Menu,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

export type Language = 'ru' | 'en' | 'uk'

interface ServiceMetaItem {
  icon: typeof Search
  accent: 'coral' | 'lime' | 'blue'
}

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
const MODEL_NAME = 'poolside/laguna-xs-2.1:free'

const LANGUAGE_CONFIG: Record<Language, { label: string; flag: string }> = {
  ru: { label: 'Русский', flag: '🇷🇺' },
  en: { label: 'English', flag: '🇬🇧' },
  uk: { label: 'Українська', flag: '🇺🇦' },
}

const SERVICE_META: ServiceMetaItem[] = [
  { icon: Search, accent: 'coral' },
  { icon: Braces, accent: 'lime' },
  { icon: Cloud, accent: 'blue' },
]

const TRANSLATIONS = {
  ru: {
    nav: {
      services: 'Сервисы',
      principles: 'Подход',
      domains: 'Домены',
      status: 'Закрытый бета-тест',
    },
    hero: {
      eyebrow: 'Независимая цифровая лаборатория',
      h1Line1: 'Много идей.',
      h1Span: 'Одна умная',
      h1Line2: ' система.',
      lead: 'Octopus — дом для будущих проектов и сервисов. Все продукты сейчас находятся в этапе закрытого бета-тестирования.',
      btnLaunch: 'Запустить гида',
      btnExplore: 'Смотреть экосистему',
      btnSkip: 'Пропустить гида',
      btnAi: 'Krakenus AI',
      mascotBadge: 'Помощник Octopus',
      mascotHint: 'Нажмите для запуска',
      mascotFlying: 'В полёте',
      mascotReturning: 'Возврат в гнездо',
      scrollCue: 'Листать',
    },
    manifesto: {
      kicker: '/ Зачем это существует',
      p1: 'Не очередная «корпорация».',
      span: ' Небольшая мастерская полезных цифровых вещей.',
      side: 'Octopus объединяет самостоятельные продукты под одним именем, общими принципами и узнаваемым характером.',
    },
    servicesSection: {
      kicker: '/ Экосистема',
      h2: 'Будущие сервисы',
      lead: 'Все планируемые сервисы находятся в этапе закрытого бета-тестирования и готовятся к последовательному релизу.',
      list: [
        {
          id: 'search',
          code: '01',
          name: 'Octopus Search',
          domain: 'search.octopus.dev',
          description: 'Быстрый поиск по нужным источникам без лишнего шума и перегруженной выдачи.',
          status: 'Закрытый бета-тест',
          badge: 'Умный фильтр',
        },
        {
          id: 'studio',
          code: '02',
          name: 'Octopus Studio',
          domain: 'studio.octopus.dev',
          description: 'Небольшие веб‑продукты, экспериментальные интерфейсы и инструменты для создателей.',
          status: 'Закрытый бета-тест',
          badge: 'Креатив',
        },
        {
          id: 'cloud',
          code: '03',
          name: 'Octopus Cloud',
          domain: 'cloud.octopus.dev',
          description: 'Единое пространство для данных и связей между будущими сервисами экосистемы.',
          status: 'Закрытый бета-тест',
          badge: 'Синхронизация',
        },
      ],
    },
    principlesSection: {
      kicker: '/ Принципы',
      h2Line1: 'Сложное',
      h2Em: 'остаётся',
      h2Line2: ' внутри.',
      seal: 'Сделано с вниманием',
      items: [
        ['Один аккаунт', 'Сервисы работают как единая система, а не набор случайных страниц.'],
        ['Честный интерфейс', 'Понятные функции, спокойный дизайн и никакой визуальной суеты.'],
        ['Малые релизы', 'Каждый продукт проходит закрытый бета-тест и постепенно дорабатывается.'],
      ],
    },
    domainsSection: {
      kicker: '/ Архитектура адресов',
      h2: 'Один бренд. Много входов.',
      p: 'Главная страница работает как карта экосистемы. Сервисы получают собственные поддомены после прохождения бета-теста.',
      note: 'На этапе закрытого бета-тестирования сервисы разворачиваются в автономных средах перед выходом в публичный релиз.',
      rootTag: 'Главный сайт',
      rootSpan: 'MAIN',
      s1Tag: 'Сервис 01',
      s2Tag: 'Сервис 02',
      s3Tag: 'Сервис 03',
    },
    closingSection: {
      kicker: '/ Начало истории',
      h2Line1: 'Сейчас идёт закрытый тест.',
      h2Em: ' Скоро публичный доступ.',
      p: 'Новые проекты появятся на этой странице по мере завершения бета-тестирования — без громких обещаний, зато с работающим кодом.',
      btnTop: 'Вернуться к началу',
    },
    footer: {
      exportBtn: 'PNG без фона',
      motto: 'Независимые продукты из одного цифрового дома.',
      projectsLink: 'Проекты',
    },
    cookie: {
      title: 'Файлы cookie',
      text: 'Мы используем файлы cookie для сохранения настроек и корректной работы сайта.',
      btnYes: 'Принять',
      btnThink: 'Напомнить позже',
    },
    geoModal: {
      title: 'Ласкаво просимо!',
      text: 'За нашими даними ви перебуваєте в Україні. Ми автоматично встановили українську мову, але ви можете у будь-який момент обрати іншу мову:',
      acceptBtn: 'Зрозуміло',
    },
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент экосистемы Octopus (Laguna XS)',
      welcome: 'Приветствую. Я **Krakenus AI** — нейросетевой ассистент Octopus Labs. Обратите внимание: все наши сервисы сейчас находятся в этапе **закрытого бета-тестирования** и еще не вышли в публичный релиз. Задавайте любые вопросы!',
      placeholder: 'Задайте вопрос Krakenus AI...',
      quickTitle: 'Частые вопросы:',
      quickPrompts: [
        'Когда релиз сервисов?',
        'Как проходит закрытый бета-тест?',
        'Что такое Octopus Search?',
        'Как устроена доменная структура?',
      ],
      clearTooltip: 'Очистить историю чата',
    },
    tourSteps: [
      {
        targetId: 'top',
        title: 'Интерактивный гид',
        text: 'Вы можете просмотреть презентацию секций или свободно изучать сайт.',
        buttonText: 'Далее',
      },
      {
        targetId: 'manifesto',
        title: '1. Манифест',
        text: 'Octopus — цифровая мастерская для полезных и минималистичных веб-инструментов.',
        buttonText: 'К сервисам',
      },
      {
        targetId: 'services',
        title: '2. Сервисы (Бета)',
        text: 'Экосистема проходит закрытое бета-тестирование: Search для поиска, Studio для инструментов и Cloud для синхронизации.',
        buttonText: 'К принципам',
      },
      {
        targetId: 'principles',
        title: '3. Наш подход',
        text: 'Единая авторизация, бета-тестирование и понятные прозрачные интерфейсы.',
        buttonText: 'К доменам',
      },
      {
        targetId: 'domains',
        title: '4. Архитектура',
        text: 'Главный сайт выступает хабом, а бета-сервисы разворачиваются на поддоменах.',
        buttonText: 'К финалу',
      },
      {
        targetId: 'closing',
        title: '5. Финал',
        text: 'Экскурсия завершена. Весь сайт разблокирован для просмотра.',
        buttonText: 'В гнездо',
      },
    ],
  },
  en: {
    nav: {
      services: 'Services',
      principles: 'Approach',
      domains: 'Domains',
      status: 'Closed Beta Test',
    },
    hero: {
      eyebrow: 'INDEPENDENT DIGITAL LAB',
      h1Line1: 'Many ideas.',
      h1Span: 'One smart',
      h1Line2: ' system.',
      lead: 'Octopus is the home for future projects and services. All products are currently in closed beta testing.',
      btnLaunch: 'Launch Guide',
      btnExplore: 'Explore Ecosystem',
      btnSkip: 'Skip Guide',
      btnAi: 'Krakenus AI',
      mascotBadge: 'Octopus Assistant',
      mascotHint: 'Click to launch',
      mascotFlying: 'In Flight',
      mascotReturning: 'Returning to Nest',
      scrollCue: 'Scroll',
    },
    manifesto: {
      kicker: '/ Why It Exists',
      p1: 'Not another mega-corporation.',
      span: ' A cozy workshop of useful digital tools.',
      side: 'Octopus unites independent products under one brand name, shared principles, and recognizable character.',
    },
    servicesSection: {
      kicker: '/ Ecosystem',
      h2: 'Future Services',
      lead: 'All planned services are currently undergoing closed beta testing prior to public release.',
      list: [
        {
          id: 'search',
          code: '01',
          name: 'Octopus Search',
          domain: 'search.octopus.dev',
          description: 'Fast, noise-free search engine focused on quality sources without bloated ads.',
          status: 'Closed Beta Test',
          badge: 'Smart Filter',
        },
        {
          id: 'studio',
          code: '02',
          name: 'Octopus Studio',
          domain: 'studio.octopus.dev',
          description: 'Compact web apps, experimental interfaces, and creative creator utilities.',
          status: 'Closed Beta Test',
          badge: 'Creative',
        },
        {
          id: 'cloud',
          code: '03',
          name: 'Octopus Cloud',
          domain: 'cloud.octopus.dev',
          description: 'Unified cloud storage connecting data across all ecosystem products.',
          status: 'Closed Beta Test',
          badge: 'Sync Engine',
        },
      ],
    },
    principlesSection: {
      kicker: '/ Principles',
      h2Line1: 'Complexity',
      h2Em: 'stays',
      h2Line2: ' inside.',
      seal: 'Built with Care',
      items: [
        ['Single Account', 'Services work as one connected ecosystem rather than disconnected pages.'],
        ['Honest Interface', 'Clear features, calm design, and zero visual clutter.'],
        ['Small Releases', 'Each product undergoes closed beta testing and evolves continuously.'],
      ],
    },
    domainsSection: {
      kicker: '/ Domain Architecture',
      h2: 'One Brand. Multiple Doors.',
      p: 'The main landing site operates as an ecosystem hub. Services receive independent subdomains upon completing beta testing.',
      note: 'During closed beta testing, products deploy in isolated environments before public launch.',
      rootTag: 'Main Portal',
      rootSpan: 'MAIN',
      s1Tag: 'Service 01',
      s2Tag: 'Service 02',
      s3Tag: 'Service 03',
    },
    closingSection: {
      kicker: '/ The Story Begins',
      h2Line1: 'Closed Beta in progress.',
      h2Em: ' Public release soon.',
      p: 'New projects will launch as soon as beta testing completes — no empty promises, just working code.',
      btnTop: 'Return to Top',
    },
    footer: {
      exportBtn: 'Transparent PNG',
      motto: 'Independent digital products from one creative home.',
      projectsLink: 'Projects',
    },
    cookie: {
      title: 'Cookie Files',
      text: 'We use cookies to save preferences and ensure proper website functionality.',
      btnYes: 'Accept',
      btnThink: 'Remind Later',
    },
    geoModal: {
      title: 'Welcome!',
      text: 'According to our location data, you are visiting from Ukraine. Language has been set to Ukrainian, but you may choose any option below:',
      acceptBtn: 'Got It',
    },
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'Octopus Labs Neural Assistant (Laguna XS)',
      welcome: 'Greetings. I am **Krakenus AI**, the neural assistant for Octopus Labs. Please note: all ecosystem products are currently in **closed beta testing** and not yet publicly released. Feel free to ask any questions!',
      placeholder: 'Ask Krakenus AI a question...',
      quickTitle: 'Common questions:',
      quickPrompts: [
        'When is the public release?',
        'How does closed beta test work?',
        'What is Octopus Search?',
        'How is domain architecture designed?',
      ],
      clearTooltip: 'Clear chat history',
    },
    tourSteps: [
      {
        targetId: 'top',
        title: 'Interactive Guide',
        text: 'You can follow the section tour or browse the site freely.',
        buttonText: 'Next',
      },
      {
        targetId: 'manifesto',
        title: '1. Manifesto',
        text: 'Octopus is a digital workshop for clean, functional web utilities.',
        buttonText: 'To Services',
      },
      {
        targetId: 'services',
        title: '2. Services (Beta)',
        text: 'The ecosystem is in closed beta testing: Search for discovery, Studio for tools, and Cloud for syncing.',
        buttonText: 'To Principles',
      },
      {
        targetId: 'principles',
        title: '3. Our Approach',
        text: 'Single sign-on, beta testing, and transparent user interfaces.',
        buttonText: 'To Domains',
      },
      {
        targetId: 'domains',
        title: '4. Architecture',
        text: 'The main site serves as a hub, with beta products operating on subdomains.',
        buttonText: 'To Finale',
      },
      {
        targetId: 'closing',
        title: '5. Finale',
        text: 'Tour completed. Full website is now unlocked.',
        buttonText: 'Back to Nest',
      },
    ],
  },
  uk: {
    nav: {
      services: 'Сервіси',
      principles: 'Підхід',
      domains: 'Домени',
      status: 'Закритий бета-тест',
    },
    hero: {
      eyebrow: 'НЕЗАЛЕЖНА ЦИФРОВА ЛАБОРАТОРІЯ',
      h1Line1: 'Багато ідей.',
      h1Span: 'Єдина розумна',
      h1Line2: ' система.',
      lead: 'Octopus — дім для майбутніх проєктів та сервісів. Усі продукти наразі перебувають у стадії закритого бета-тестування.',
      btnLaunch: 'Запустити ґіда',
      btnExplore: 'Дивитися екосистему',
      btnSkip: 'Пропустити ґіда',
      btnAi: 'Krakenus AI',
      mascotBadge: 'Помічник Octopus',
      mascotHint: 'Натисніть для запуску',
      mascotFlying: 'У польоті',
      mascotReturning: 'Повернення до гнізда',
      scrollCue: 'Гортати',
    },
    manifesto: {
      kicker: '/ Навіщо це існує',
      p1: 'Не чергова «корпорація».',
      span: ' Невелика майстерня корисних цифрових речей.',
      side: 'Octopus об\'єднує самостійні продукти під одним ім\'ям, спільними принципами та впізнаваним характером.',
    },
    servicesSection: {
      kicker: '/ Екосистема',
      h2: 'Майбутні сервіси',
      lead: 'Усі заплановані сервіси перебувають у стадії закритого бета-тестування та готуються до послідовного релізу.',
      list: [
        {
          id: 'search',
          code: '01',
          name: 'Octopus Search',
          domain: 'search.octopus.dev',
          description: 'Швидкий пошук по потрібних джерелах без зайвого шуму та перевантаженої видачі.',
          status: 'Закритий бета-тест',
          badge: 'Розумний фільтр',
        },
        {
          id: 'studio',
          code: '02',
          name: 'Octopus Studio',
          domain: 'studio.octopus.dev',
          description: 'Невеликі веб-продукти, експериментальні інтерфейси та інструменти для творців.',
          status: 'Закритий бета-тест',
          badge: 'Креатив',
        },
        {
          id: 'cloud',
          code: '03',
          name: 'Octopus Cloud',
          domain: 'cloud.octopus.dev',
          description: 'Єдиний простір для даних та зв\'язків між майбутніми сервісами екосистеми.',
          status: 'Закритий бета-тест',
          badge: 'Синхронізація',
        },
      ],
    },
    principlesSection: {
      kicker: '/ Принципи',
      h2Line1: 'Складне',
      h2Em: 'залишається',
      h2Line2: ' всередині.',
      seal: 'Зроблено з увагою',
      items: [
        ['Єдиний акаунт', 'Сервіси працюють як єдина система, а не набір випадкових сторінок.'],
        ['Чесний інтерфейс', 'Зрозумілі функції, спокійний дизайн і жодної візуальної метушні.'],
        ['Малі релізи', 'Кожен продукт проходить закритий бета-тест та поступово вдосконалюється.'],
      ],
    },
    domainsSection: {
      kicker: '/ Архітектура адрес',
      h2: 'Один бренд. Багато входів.',
      p: 'Головна сторінка працює як карта екосистеми. Сервіси отримують власні піддомени після завершення бета-тесту.',
      note: 'На етапі закритого бета-тестування сервіси розгортаються у закритому середовищі перед публічним релізом.',
      rootTag: 'Головний сайт',
      rootSpan: 'MAIN',
      s1Tag: 'Сервіс 01',
      s2Tag: 'Сервіс 02',
      s3Tag: 'Сервіс 03',
    },
    closingSection: {
      kicker: '/ Початок історії',
      h2Line1: 'Наразі триває закритий тест.',
      h2Em: ' Незабаром реліз.',
      p: 'Нові проєкти з\'являться на цій сторінці після бета-тестування — без гучних обіцянок, зате з працюючим кодом.',
      btnTop: 'Повернутися на початок',
    },
    footer: {
      exportBtn: 'PNG без фону',
      motto: 'Незалежні продукти з одного цифрового дому.',
      projectsLink: 'Проєкти',
    },
    cookie: {
      title: 'Файли cookie',
      text: 'Ми використовуємо файли cookie для збереження налаштувань та належної роботи сайту.',
      btnYes: 'Прийняти',
      btnThink: 'Нагадати пізніше',
    },
    geoModal: {
      title: 'Ласкаво просимо!',
      text: 'За нашими даними ви перебуваєте в Україні. Ми автоматично встановили українську мову, але ви можете обрати будь-яку іншу:',
      acceptBtn: 'Зрозуміло',
    },
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ШІ-асистент екосистеми Octopus Labs (Laguna XS)',
      welcome: 'Вітаю. Я **Krakenus AI** — нейромережевий асистент Octopus Labs. Зверніть увагу: усі наші сервіси наразі перебувають у стадії **закритого бета-тестування** і ще не вийшли у публічний реліз. Задавайте будь-які питання!',
      placeholder: 'Задайте питання Krakenus AI...',
      quickTitle: 'Часті питання:',
      quickPrompts: [
        'Коли публічний реліз?',
        'Як проходить закритий бета-тест?',
        'Що таке Octopus Search?',
        'Як влаштована доменна структура?',
      ],
      clearTooltip: 'Очистити історію чату',
    },
    tourSteps: [
      {
        targetId: 'top',
        title: 'Інтерактивний ґід',
        text: 'Ви можете переглянути презентацію секцій або вільно досліджувати сайт.',
        buttonText: 'Далі',
      },
      {
        targetId: 'manifesto',
        title: '1. Маніфест',
        text: 'Octopus — цифрова майстерня для корисних та лаконічних веб-інструментів.',
        buttonText: 'До сервісів',
      },
      {
        targetId: 'services',
        title: '2. Сервіси (Бета)',
        text: 'Екосистема у закритому бета-тестуванні: Search для пошуку, Studio для інструментів і Cloud для синхронізації.',
        buttonText: 'До принципів',
      },
      {
        targetId: 'principles',
        title: '3. Наш підхід',
        text: 'Єдина авторизація, бета-тестування та зрозумілі прозорі інтерфейси.',
        buttonText: 'До доменів',
      },
      {
        targetId: 'domains',
        title: '4. Архітектура',
        text: 'Головний сайт виступає хабом, а бета-сервіси працюють на піддоменах.',
        buttonText: 'До фіналу',
      },
      {
        targetId: 'closing',
        title: '5. Фінал',
        text: 'Екскурсію завершено. Весь сайт розблоковано для перегляду.',
        buttonText: 'У гніздо',
      },
    ],
  },
}

function parseInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

function FormattedAiText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="formatted-ai-content">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={lineIdx} className="formatted-spacer" />

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="formatted-list-item">
              <span className="list-bullet">•</span>
              <span>{parseInlineMarkdown(trimmed.substring(2))}</span>
            </div>
          )
        }

        return <p key={lineIdx}>{parseInlineMarkdown(line)}</p>
      })}
    </div>
  )
}

function OctopusMark({ compact = false, animated = false }: { compact?: boolean; animated?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? 'brand-mark--compact' : ''} ${animated ? 'brand-mark--animated' : ''}`} aria-hidden="true">
      <span className="brand-mark__head">
        <span className="brand-mark__eye" />
        <span className="brand-mark__eye" />
      </span>
      <span className="brand-mark__legs">
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  )
}

function JetpackOctopusMascot() {
  return (
    <div className="jetpack-octopus-avatar">
      <div className="jetpack-unit">
        <span className="jetpack-tank jetpack-tank--left">
          <span className="jetpack-cap" />
        </span>
        <span className="jetpack-tank jetpack-tank--right">
          <span className="jetpack-cap" />
        </span>
        <span className="jetpack-nozzle jetpack-nozzle--left" />
        <span className="jetpack-nozzle jetpack-nozzle--right" />
        <span className="jetpack-flame jetpack-flame--left" />
        <span className="jetpack-flame jetpack-flame--right" />
      </div>
      <OctopusMark animated />
    </div>
  )
}

function LanguageSelectorMenu({
  currentLang,
  onSelectLang,
}: {
  currentLang: Language
  onSelectLang: (lang: Language) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="lang-menu-ref" ref={menuRef}>
      <button
        type="button"
        className="lang-selector-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Выбор языка / Language menu"
      >
        <Globe size={14} />
        <span className="lang-code">{currentLang.toUpperCase()}</span>
        <ChevronDown size={11} className={`lang-chevron ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <div className="lang-dropdown-panel reveal-in">
          {(Object.keys(LANGUAGE_CONFIG) as Language[]).map((langKey) => (
            <button
              key={langKey}
              type="button"
              className={`lang-option-item ${currentLang === langKey ? 'is-active' : ''}`}
              onClick={() => {
                onSelectLang(langKey)
                setOpen(false)
              }}
            >
              <span className="option-flag">{LANGUAGE_CONFIG[langKey].flag}</span>
              <span className="option-label">{LANGUAGE_CONFIG[langKey].label}</span>
              {currentLang === langKey && <Check size={14} className="option-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function downloadLogoTransparent() {
  const canvas = document.createElement('canvas')
  canvas.width = 560
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" width="560" height="160">
    <style>
      .head { fill: #ef745f; }
      .eye { fill: #0a1c1c; }
      .leg { fill: #ef745f; transform-origin: top center; }
      .text { font-family: 'Unbounded', 'Manrope', system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 30px; fill: #142b2b; letter-spacing: 2px; }
    </style>
    <g transform="translate(10, 8)">
      <rect class="head" x="5" y="0" width="46" height="38" rx="20" ry="18" />
      <ellipse class="eye" cx="20" cy="19" rx="2.5" ry="4" />
      <ellipse class="eye" cx="36" cy="19" rx="2.5" ry="4" />
      <rect class="leg" x="6" y="32" width="9" height="20" rx="4.5" transform="rotate(18 10.5 32)" />
      <rect class="leg" x="17" y="33" width="9" height="20" rx="4.5" transform="rotate(6 21.5 33)" />
      <rect class="leg" x="28" y="33" width="9" height="20" rx="4.5" transform="rotate(-6 32.5 33)" />
      <rect class="leg" x="39" y="32" width="9" height="20" rx="4.5" transform="rotate(-18 43.5 32)" />
    </g>
    <text x="82" y="48" class="text">OCTOPUS</text>
  </svg>`

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()

  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)

    const pngUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = 'octopus-logo-transparent.png'
    a.click()
  }
  img.src = url
}

function HomePage() {
  const [lang, setLang] = useState<Language>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Tour state with localStorage persistence
  const [tourUnlocked, setTourUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('octopus_tour_completed') === 'true'
    }
    return false
  })
  const [tourActive, setTourActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Flight Animations (Takeoff & Landing Back)
  const [isTakingOff, setIsTakingOff] = useState(false)
  const [isLandingBack, setIsLandingBack] = useState(false)

  // IP Geolocation Modal & Cookie Consent Banner State
  const [geoModalOpen, setGeoModalOpen] = useState(false)
  const [cookieConsentOpen, setCookieConsentOpen] = useState(false)

  // Krakenus AI 1.0 State with localStorage Context Persistence
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('octopus_krakenus_chat')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        } catch (e) {
          // ignore invalid JSON
        }
      }
    }
    return []
  })

  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Save chat context to localStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('octopus_krakenus_chat', JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Clear chat context
  const handleClearChat = () => {
    localStorage.removeItem('octopus_krakenus_chat')
    setChatMessages([{ sender: 'ai', text: TRANSLATIONS[lang].krakenusAi.welcome }])
  }

  // Cookie Consent Banner Check
  useEffect(() => {
    const consent = localStorage.getItem('octopus_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setCookieConsentOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  // IP Geolocation Check & Language Persistence Fix
  useEffect(() => {
    const savedLang = localStorage.getItem('octopus_lang') as Language
    const geoPrompted = localStorage.getItem('octopus_geo_prompted')

    if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'uk')) {
      setLang(savedLang)
      return // STRICT PERSISTENCE FIX: Do NOT run IP geolocation if user previously saved language preference!
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeoutId)
        if (data && data.country_code) {
          const country = String(data.country_code).toUpperCase()
          if (country === 'UA') {
            setLang('uk')
            localStorage.setItem('octopus_lang', 'uk')
            if (!geoPrompted) {
              setGeoModalOpen(true)
            }
          }
        }
      })
      .catch(() => {
        const navLang = navigator.language ? navigator.language.toLowerCase() : ''
        if (navLang.includes('uk')) {
          setLang('uk')
          if (!geoPrompted) {
            setGeoModalOpen(true)
          }
        }
      })
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('octopus_lang', newLang)
  }

  const t = TRANSLATIONS[lang]

  // Initialize welcome message when AI modal opens if no messages exist
  useEffect(() => {
    if (aiModalOpen && chatMessages.length === 0) {
      setChatMessages([{ sender: 'ai', text: t.krakenusAi.welcome }])
    }
  }, [aiModalOpen, chatMessages.length, t.krakenusAi.welcome])

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const els = document.querySelectorAll('.reveal-on-scroll')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Scroll progress bar & Auto-switch step on manual scroll
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100)
      }

      if (tourActive && !isLandingBack) {
        const sectionIds = t.tourSteps.map((s) => s.targetId)
        const scrollPos = window.scrollY + window.innerHeight / 2.2

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i])
          if (el) {
            const top = el.offsetTop
            if (scrollPos >= top - 80) {
              setCurrentStepIndex(i)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tourActive, isLandingBack, t.tourSteps])

  // OpenRouter API Call to Krakenus AI with Language Fallback Fix
  const handleSendAiMessage = async (textToSend?: string) => {
    const prompt = (textToSend || aiInput).trim()
    if (!prompt || aiLoading) return

    const updatedMessages = [...chatMessages, { sender: 'user' as const, text: prompt }]
    setChatMessages(updatedMessages)
    setAiInput('')
    setAiLoading(true)

    setChatMessages((prev) => [...prev, { sender: 'ai' as const, text: '...' }])

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    const systemPrompt = `You are Krakenus AI, the official neural assistant for Octopus Labs. You respond cleanly, professionally, and warmly in the user's language (${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}).

IMPORTANT STATUS DIRECTIVE:
All planned ecosystem products (Octopus Search, Octopus Studio, Octopus Cloud) are currently in CLOSED BETA TESTING (Закрытый Бета-Тест) and NOT yet publicly released. If asked about release or availability, explain that closed beta testing is underway to ensure high quality before public release.`

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://octopus.dev',
          'X-Title': 'Octopus Labs',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          ],
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || (
        lang === 'uk' ? 'Запит оброблено. Спробуйте уточнити запитання.' :
        lang === 'en' ? 'Request processed. Please refine your question.' :
        'Запрос обработан. Попробуйте уточнить вопрос.'
      )

      setChatMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { sender: 'ai', text: reply }
        return next
      })
    } catch (err) {
      console.error('Krakenus AI error:', err)
      setChatMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          sender: 'ai',
          text: lang === 'uk'
            ? 'Вибачте! Сталася невелика мережева пауза. Будь ласка, спробуйте ще раз.'
            : lang === 'en'
            ? 'Sorry! A brief network error occurred. Please try asking again.'
            : 'Извините! Произошла небольшая пауза сети. Задайте вопрос ещё раз.',
        }
        return next
      })
    } finally {
      setAiLoading(false)
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const startTour = () => {
    setIsTakingOff(true)
    setTourActive(true)
    setCurrentStepIndex(0)
    scrollToTarget('top')

    setTimeout(() => {
      setIsTakingOff(false)
    }, 1100)
  }

  const advanceTour = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < t.tourSteps.length) {
      setCurrentStepIndex(nextIndex)
      scrollToTarget(t.tourSteps[nextIndex].targetId)
    } else {
      finishTour()
    }
  }

  const finishTour = () => {
    setIsLandingBack(true)
    setTourUnlocked(true)
    localStorage.setItem('octopus_tour_completed', 'true')
    
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setTimeout(() => {
      setIsLandingBack(false)
      setTourActive(false)
      setCurrentStepIndex(0)
    }, 1200)
  }

  const scrollToTarget = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const currentStep = t.tourSteps[currentStepIndex]

  return (
    <main className={!tourUnlocked && !tourActive ? 'site-locked' : ''}>
      {/* Top Scroll Progress Indicator */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* KRAKENUS AI MODAL */}
      {aiModalOpen && (
        <div className="ai-modal-backdrop" onClick={() => setAiModalOpen(false)}>
          <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-title-group">
                <div className="ai-avatar-badge">
                  <OctopusMark compact animated />
                </div>
                <div>
                  <h3>{t.krakenusAi.title}</h3>
                  <small className="ai-status-indicator">
                    <span className="live-dot" />
                    {t.krakenusAi.subtitle}
                  </small>
                </div>
              </div>

              <div className="ai-header-controls">
                <button
                  type="button"
                  className="ai-clear-btn"
                  onClick={handleClearChat}
                  title={t.krakenusAi.clearTooltip}
                  aria-label="Clear chat context"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  className="geo-close-btn"
                  onClick={() => setAiModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="ai-chat-stream">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-row chat-bubble--${msg.sender}`}>
                  <div className="chat-avatar">
                    {msg.sender === 'ai' ? <OctopusMark compact animated /> : <User size={14} />}
                  </div>
                  <div className="chat-bubble-text">
                    <FormattedAiText text={msg.text} />
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="ai-typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="ai-quick-suggestions">
              <span>{t.krakenusAi.quickTitle}</span>
              <div className="quick-prompt-chips">
                {t.krakenusAi.quickPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="prompt-chip"
                    onClick={() => handleSendAiMessage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="ai-input-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendAiMessage()
              }}
            >
              <input
                type="text"
                className="ai-input-field"
                placeholder={t.krakenusAi.placeholder}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                disabled={aiLoading}
                autoFocus
              />
              <button type="submit" className="ai-send-btn" disabled={aiLoading || !aiInput.trim()} aria-label="Send">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COOKIE CONSENT BANNER POPUP */}
      {cookieConsentOpen && (
        <div className="cookie-banner-card reveal-in">
          <div className="cookie-content">
            <div className="cookie-icon-box">
              <Cookie size={22} />
            </div>
            <div>
              <h4>{t.cookie.title}</h4>
              <p>{t.cookie.text}</p>
            </div>
          </div>
          <div className="cookie-actions">
            <button
              type="button"
              className="cookie-btn cookie-btn--accept"
              onClick={() => {
                localStorage.setItem('octopus_cookie_consent', 'true')
                setCookieConsentOpen(false)
              }}
            >
              {t.cookie.btnYes}
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn--think"
              onClick={() => {
                setCookieConsentOpen(false)
              }}
            >
              {t.cookie.btnThink}
            </button>
          </div>
        </div>
      )}

      {/* GEOLOCATION WELCOME MODAL */}
      {geoModalOpen && (
        <div className="geo-modal-backdrop">
          <div className="geo-modal-card">
            <div className="geo-modal-header">
              <span className="geo-flag">🇺🇦</span>
              <h3>{t.geoModal.title}</h3>
              <button
                type="button"
                className="geo-close-btn"
                onClick={() => {
                  setGeoModalOpen(false)
                  localStorage.setItem('octopus_geo_prompted', 'true')
                }}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <p className="geo-modal-text">{t.geoModal.text}</p>

            <div className="geo-lang-buttons">
              {(Object.keys(LANGUAGE_CONFIG) as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`geo-lang-btn ${lang === l ? 'is-active' : ''}`}
                  onClick={() => handleSetLang(l)}
                >
                  <span>{LANGUAGE_CONFIG[l].flag}</span>
                  <span>{LANGUAGE_CONFIG[l].label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="geo-accept-btn"
              onClick={() => {
                setGeoModalOpen(false)
                localStorage.setItem('octopus_geo_prompted', 'true')
              }}
            >
              {t.geoModal.acceptBtn}
            </button>
          </div>
        </div>
      )}

      {/* FLYING JETPACK OCTOPUS ASSISTANT */}
      {(tourActive || isLandingBack) && (
        <aside className={`jetpack-assistant-overlay ${isTakingOff ? 'is-taking-off' : ''} ${isLandingBack ? 'is-landing-back' : ''}`}>
          <div className="jetpack-mascot-container">
            <JetpackOctopusMascot />
          </div>
          {!isLandingBack && (
            <div className="jetpack-speech-bubble">
              <div className="tour-assistant-header">
                <h4>{currentStep.title}</h4>
                <button
                  type="button"
                  className="tour-close-btn"
                  onClick={finishTour}
                  title="Закрыть гид"
                >
                  <X size={13} />
                </button>
              </div>
              <p>{currentStep.text}</p>
              <div className="tour-assistant-footer">
                <span className="tour-step-counter">
                  {currentStepIndex + 1} / {t.tourSteps.length}
                </span>
                <button type="button" className="tour-next-btn" onClick={advanceTour}>
                  <Rocket size={13} />
                  <span>{currentStep.buttonText}</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Octopus — на главную">
          <OctopusMark compact animated />
          <span>OCTOPUS</span>
          <sup>LABS</sup>
        </a>

        {tourUnlocked && (
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#services">{t.nav.services}</a>
            <a href="#principles">{t.nav.principles}</a>
            <a href="#domains">{t.nav.domains}</a>
          </nav>
        )}

        <div className="header-actions-right">
          <button
            type="button"
            className="ai-trigger-btn"
            onClick={() => setAiModalOpen(true)}
            title="Запустить Krakenus AI"
          >
            <Bot size={15} />
            <span>{t.hero.btnAi}</span>
          </button>

          <LanguageSelectorMenu currentLang={lang} onSelectLang={handleSetLang} />

          <a className="header-status" href="#services">
            <span />
            {t.nav.status}
            <ArrowDownRight size={15} />
          </a>

          {tourUnlocked && (
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>

        {menuOpen && tourUnlocked && (
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            {[
              [t.nav.services, '#services'],
              [t.nav.principles, '#principles'],
              [t.nav.domains, '#domains'],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ChevronRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="hero hero--compact" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow reveal reveal-1">
            <Asterisk size={15} />
            {t.hero.eyebrow}
          </div>
          <h1 className="reveal reveal-2">
            {t.hero.h1Line1}
            <br />
            <span>{t.hero.h1Span}</span>
            {t.hero.h1Line2}
          </h1>
          <p className="hero-lead reveal reveal-3">
            {t.hero.lead}
          </p>
          <div className="hero-actions reveal reveal-4">
            {!tourUnlocked ? (
              <button type="button" className="button button--primary button--jetpack" onClick={startTour}>
                <Rocket size={18} />
                {t.hero.btnLaunch}
              </button>
            ) : (
              <a className="button button--primary" href="#services">
                {t.hero.btnExplore}
                <ArrowRight size={18} />
              </a>
            )}

            <button type="button" className="button button--ai" onClick={() => setAiModalOpen(true)}>
              <Bot size={17} />
              {t.hero.btnAi}
            </button>

            {!tourUnlocked && (
              <button type="button" className="text-link" onClick={finishTour}>
                {t.hero.btnSkip}
                <ArrowDownRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Central Mascot Nest Circle */}
        <div className="hero-mascot-wrapper reveal reveal-3">
          <button
            type="button"
            className={`hero-mascot-card ${tourActive || isLandingBack ? 'is-flying-out' : ''}`}
            onClick={startTour}
            title={tourActive ? t.hero.mascotFlying : t.hero.mascotHint}
          >
            {!tourActive && !isLandingBack ? (
              <>
                <div className="mascot-avatar">
                  <OctopusMark animated />
                </div>
                <div className="mascot-badge">
                  <Sparkles size={13} />
                  <span>{t.hero.mascotBadge}</span>
                </div>
                <small>{t.hero.mascotHint}</small>
              </>
            ) : (
              <div className="mascot-nest-empty">
                <span className="nest-ring" />
                <p>{isLandingBack ? t.hero.mascotReturning : t.hero.mascotFlying}</p>
              </div>
            )}
          </button>
        </div>

        <div className="hero-index" aria-hidden="true">01 — 08</div>
        {tourUnlocked && (
          <a className="scroll-cue" href="#services" aria-label="Прокрутить к сервисам">
            <span>{t.hero.scrollCue}</span>
            <ArrowDownRight size={18} />
          </a>
        )}
      </section>

      {/* REST OF SITE */}
      <div className={`site-sections-wrap ${!tourUnlocked && !tourActive ? 'is-locked-sections' : ''}`}>
        <section className="manifesto reveal-on-scroll" id="manifesto">
          <div className="section-kicker">{t.manifesto.kicker}</div>
          <div className="manifesto-main">
            <p>
              {t.manifesto.p1}
              <span>{t.manifesto.span}</span>
            </p>
          </div>
          <div className="manifesto-side">
            <Compass size={28} className="spin-on-hover" />
            <p>{t.manifesto.side}</p>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading reveal-on-scroll">
            <div>
              <div className="section-kicker section-kicker--light">{t.servicesSection.kicker}</div>
              <h2>{t.servicesSection.h2}</h2>
            </div>
            <p>{t.servicesSection.lead}</p>
          </div>

          <div className="services-list">
            {t.servicesSection.list.map((service, index) => {
              const Icon = SERVICE_META[index].icon
              const accent = SERVICE_META[index].accent
              return (
                <article
                  className={`service-row service-row--${accent} reveal-on-scroll`}
                  key={service.code}
                  onClick={() => setAiModalOpen(true)}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  title="Задать вопрос Krakenus AI"
                >
                  <div className="service-number">{service.code}</div>
                  <div className="service-icon"><Icon strokeWidth={1.6} /></div>
                  <div className="service-copy">
                    <div className="service-title-line">
                      <h3>{service.name}</h3>
                      <span className="service-status">{service.status}</span>
                      <span className="service-badge">{service.badge}</span>
                    </div>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-domain">
                    <Globe2 size={16} />
                    {service.domain}
                  </div>
                  <div className="service-arrow"><ArrowDownRight /></div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="principles-section" id="principles">
          <div className="principles-intro reveal-on-scroll">
            <div className="section-kicker">{t.principlesSection.kicker}</div>
            <h2>{t.principlesSection.h2Line1}<br /><em>{t.principlesSection.h2Em}</em>{t.principlesSection.h2Line2}</h2>
            <div className="principles-seal">
              <ShieldCheck size={20} />
              <span>{t.principlesSection.seal}</span>
            </div>
          </div>
          <div className="principle-list">
            {t.principlesSection.items.map(([title, description], index) => (
              <div
                className="principle-item reveal-on-scroll"
                key={title}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <Check size={18} />
              </div>
            ))}
          </div>
        </section>

        <section className="domains-section" id="domains">
          <div className="domain-copy reveal-on-scroll">
            <div className="section-kicker section-kicker--light">{t.domainsSection.kicker}</div>
            <h2>{t.domainsSection.h2}</h2>
            <p>{t.domainsSection.p}</p>
            <div className="domain-note">
              <Sparkles size={18} className="pulse-sparkle" />
              <span>{t.domainsSection.note}</span>
            </div>
          </div>

          <div className="domain-map reveal-on-scroll" aria-label="Пример структуры доменов">
            <div className="domain-root">
              <div className="domain-root__icon"><Boxes /></div>
              <div>
                <small>{t.domainsSection.rootTag}</small>
                <strong>octopus.netlify.app</strong>
              </div>
              <span>{t.domainsSection.rootSpan}</span>
            </div>
            <div className="domain-branch" />
            <div className="domain-child domain-child--one">
              <Search size={18} />
              <div><small>{t.domainsSection.s1Tag}</small><strong>search.octopus.dev</strong></div>
            </div>
            <div className="domain-child domain-child--two">
              <Braces size={18} />
              <div><small>{t.domainsSection.s2Tag}</small><strong>studio.octopus.dev</strong></div>
            </div>
            <div className="domain-child domain-child--three">
              <Cloud size={18} />
              <div><small>{t.domainsSection.s3Tag}</small><strong>cloud.octopus.dev</strong></div>
            </div>
          </div>
        </section>

        <section className="closing-section reveal-on-scroll" id="closing">
          <div className="closing-shape" aria-hidden="true">
            <OctopusMark animated />
          </div>
          <div className="section-kicker">{t.closingSection.kicker}</div>
          <h2>{t.closingSection.h2Line1}<br /><em>{t.closingSection.h2Em}</em></h2>
          <p>{t.closingSection.p}</p>
          <a className="button button--dark" href="#top">
            {t.closingSection.btnTop}
            <ArrowRight size={18} />
          </a>
        </section>

        <footer>
          <div className="footer-brand-wrap reveal-on-scroll">
            <a className="brand brand--footer" href="#top" aria-label="Octopus — на главную">
              <OctopusMark compact animated />
              <span>OCTOPUS</span>
            </a>
            <button
              className="export-logo-btn"
              onClick={() => downloadLogoTransparent()}
              type="button"
              title="Скачать логотип в PNG без фона"
            >
              <Download size={13} />
              <span>{t.footer.exportBtn}</span>
            </button>
          </div>
          <p className="reveal-on-scroll">{t.footer.motto}</p>
          <div className="footer-meta reveal-on-scroll">
            <span>© {new Date().getFullYear()}</span>
            <a href="#services">{t.footer.projectsLink} <ExternalLink size={13} /></a>
          </div>
        </footer>
      </div>
    </main>
  )
}
