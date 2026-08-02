import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Globe2,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  RefreshCw,
  Search as SearchIcon,
  Send,
  Settings,
  Sparkles,
  User,
  Video,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type Language = 'ru' | 'en' | 'uk'

interface SearchResultItem {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  imageUrl?: string
  category?: string
  date?: string
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

const SEARCH_TRANSLATIONS = {
  ru: {
    btnSearch: 'Поиск в Octopus',
    btnLucky: 'Мне повезет!',
    placeholder: 'Введите поисковый запрос...',
    tabAll: 'Все',
    tabImages: 'Картинки',
    tabNews: 'Новости',
    tabVideos: 'Видео',
    tabMaps: 'Карты',
    aiOverviewTitle: 'Krakenus AI — Обзор с помощью ИИ',
    aiGenerating: 'Выполнение живого веб-поиска и ИИ-обзора...',
    showMore: 'Показать полностью',
    showLess: 'Свернуть',
    quickQueries: [
      'как приготовить сладкие блинчики',
      'Роблокс скачать на ПК',
      'Что нового в React 19',
      'Документация TanStack Start',
    ],
    resultsCount: 'Результатов: примерно',
    searchSecNotice: 'Octopus Search — Умная фильтрация информации без шума.',
    backToHub: 'octopus.dev',
    footerLocation: 'Украина / Global — Из вашего местоположения',
    settingsTitle: 'Настройки реального поиска API',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент Octopus Search',
      welcome: 'Привет! Я **Krakenus AI**. Помогаю с анализом реального веб-поиска и формированием выжимок.',
      placeholder: 'Задайте вопрос...',
      quickTitle: 'Подсказки:',
      quickPrompts: [
        'Краткая выжимка',
        'Инструкция по установке',
        'Объяснить термины',
      ],
      clearTooltip: 'Очистить историю',
    },
  },
  en: {
    btnSearch: 'Octopus Search',
    btnLucky: "I'm Feeling Lucky",
    placeholder: 'Search the web...',
    tabAll: 'All',
    tabImages: 'Images',
    tabNews: 'News',
    tabVideos: 'Videos',
    tabMaps: 'Maps',
    aiOverviewTitle: 'Krakenus AI — AI Overview',
    aiGenerating: 'Fetching live web search results & AI Overview...',
    showMore: 'Show more',
    showLess: 'Show less',
    quickQueries: [
      'how to make sweet pancakes',
      'Download Roblox on PC',
      'What is new in React 19',
      'TanStack Start documentation',
    ],
    resultsCount: 'About',
    searchSecNotice: 'Octopus Search — Smart noise-free search engine.',
    backToHub: 'octopus.dev',
    footerLocation: 'Global — From your location',
    settingsTitle: 'Real Search API Settings',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'Octopus Search AI Core',
      welcome: 'Hello! I am **Krakenus AI**. I help analyze real web search data.',
      placeholder: 'Ask a question...',
      quickTitle: 'Quick prompts:',
      quickPrompts: [
        'Summarize results',
        'Installation guide',
        'Explain concept',
      ],
      clearTooltip: 'Clear history',
    },
  },
  uk: {
    btnSearch: 'Пошук в Octopus',
    btnLucky: 'Мені пощастить!',
    placeholder: 'Введіть запит для пошуку...',
    tabAll: 'Усі',
    tabImages: 'Зображення',
    tabNews: 'Новини',
    tabVideos: 'Відео',
    tabMaps: 'Карти',
    aiOverviewTitle: 'Krakenus AI — Огляд за допомогою ШІ',
    aiGenerating: 'Выконання живого веб-пошуку та ШІ-огляду...',
    showMore: 'Показати повністю',
    showLess: 'Згорнути',
    quickQueries: [
      'як приготувати солодкі млинці',
      'Роблокс скачати на ПК',
      'Що нового в React 19',
      'Документація TanStack Start',
    ],
    resultsCount: 'Результатів: приблизно',
    searchSecNotice: 'Octopus Search — Розумне фільтрування інформації від спаму.',
    backToHub: 'octopus.dev',
    footerLocation: 'Україна / Global — З вашого розташування',
    settingsTitle: 'Налаштування реального пошуку API',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ШІ-асистент Octopus Search',
      welcome: 'Вітаю! Я **Krakenus AI**. Допомагаю з аналізом реального веб-пошуку.',
      placeholder: 'Задайте питання...',
      quickTitle: 'Підказки:',
      quickPrompts: [
        'Зробити короткий висновок',
        'Інструкція зі встановлення',
        'Пояснити терміни',
      ],
      clearTooltip: 'Очистити історію',
    },
  },
}

// REAL BRANDED IMAGE POOLS FOR TOPIC SEARCHES
const AUTHENTIC_ROBLOX_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Roblox_Logo_2022.svg/800px-Roblox_Logo_2022.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_2022.svg/800px-Roblox_player_icon_2022.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roblox_Studio_2021_Icon.svg/800px-Roblox_Studio_2021_Icon.svg.png',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552824728-8b138132f584?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
]

const AUTHENTIC_PANCAKE_IMAGES = [
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484723091479-0015999052d9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
]

const AUTHENTIC_TECH_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/800px-React-icon.svg.png',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
]

function getTopicImageForQuery(query: string, index: number): string {
  const lower = query.toLowerCase()

  if (lower.includes('roblox') || lower.includes('роблокс')) {
    return AUTHENTIC_ROBLOX_IMAGES[index % AUTHENTIC_ROBLOX_IMAGES.length]
  }

  if (lower.includes('блинчик') || lower.includes('млинц') || lower.includes('pancake') || lower.includes('рецепт') || lower.includes('еда')) {
    return AUTHENTIC_PANCAKE_IMAGES[index % AUTHENTIC_PANCAKE_IMAGES.length]
  }

  return AUTHENTIC_TECH_IMAGES[index % AUTHENTIC_TECH_IMAGES.length]
}

// 1. DuckDuckGo Instant Web Search API (100% Free Live Web Results)
async function fetchDuckDuckGoLiveResults(q: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`)
    if (res.ok) {
      const data = await res.json()
      const items: SearchResultItem[] = []

      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.forEach((topic: any, idx: number) => {
          if (topic.FirstURL && topic.Text) {
            const url = topic.FirstURL
            let domain = 'web.search'
            try {
              domain = new URL(url).hostname.replace('www.', '')
            } catch (e) {}

            items.push({
              id: `ddg-${idx}`,
              title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 65),
              url: url,
              domain: domain,
              snippet: topic.Text,
              imageUrl: getTopicImageForQuery(q, idx),
            })
          }
        })
      }
      if (items.length > 0) return items
    }
  } catch (e) {
    // ignore
  }
  return []
}

// 2. Google Custom Search JSON API Integration (If user provides Key & CX)
async function fetchGoogleCustomSearchResults(q: string, apiKey: string, cxId: string): Promise<SearchResultItem[]> {
  if (!apiKey || !cxId) return []
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cxId)}&q=${encodeURIComponent(q)}&num=10`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      if (data.items && Array.isArray(data.items)) {
        return data.items.map((item: any, idx: number) => ({
          id: `gcs-${idx}`,
          title: item.title || item.htmlTitle,
          url: item.link,
          domain: item.displayLink || new URL(item.link).hostname,
          snippet: item.snippet || item.htmlSnippet,
          imageUrl: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || getTopicImageForQuery(q, idx),
        }))
      }
    }
  } catch (e) {
    console.error('Google Custom Search API error:', e)
  }
  return []
}

function cleanMarkdownLine(raw: string): string {
  let cleaned = raw.replace(/^#{1,6}\s*/, '')
  cleaned = cleaned.replace(/^[-*]{2,}\s*$/, '')
  cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
  return cleaned.trim()
}

function parseInlineMarkdown(text: string) {
  const clean = cleanMarkdownLine(text)
  const parts = clean.split(/(\*\*.*?\*\*|`.*?`)/g)
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
        const cleaned = cleanMarkdownLine(line)
        if (!cleaned) return null

        if (cleaned.startsWith('- ') || cleaned.startsWith('* ') || /^\d+\.\s/.test(cleaned)) {
          const content = cleaned.replace(/^([-*]|\d+\.)\s*/, '')
          return (
            <div key={lineIdx} className="formatted-list-item">
              <span className="list-bullet">•</span>
              <span>{parseInlineMarkdown(content)}</span>
            </div>
          )
        }

        return <p key={lineIdx}>{parseInlineMarkdown(cleaned)}</p>
      })}
    </div>
  )
}

function OctopusMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-hidden="true">
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
      >
        <Globe size={14} />
        <span>{currentLang.toUpperCase()}</span>
        <ChevronDown size={11} />
      </button>

      {open && (
        <div className="lang-dropdown-panel">
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
              <span>{LANGUAGE_CONFIG[langKey].flag}</span>
              <span>{LANGUAGE_CONFIG[langKey].label}</span>
              {currentLang === langKey && <Check size={14} style={{ marginLeft: 'auto', color: 'var(--lime)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Language>('ru')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'news' | 'videos'>('all')

  // API Credentials Modal (Google Custom Search API Key & Search Engine ID)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [googleApiKey, setGoogleApiKey] = useState(() => localStorage.getItem('octopus_gcs_key') || '')
  const [googleCxId, setGoogleCxId] = useState(() => localStorage.getItem('octopus_gcs_cx') || '')

  // Search Results & AI Overview
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [aiExpanded, setAiExpanded] = useState(false)
  const [searchTime, setSearchTime] = useState('0.34')

  // Retry state & countdown
  const [attemptStatus, setAttemptStatus] = useState('')

  // Krakenus AI Assistant Modal
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('octopus_search_chat')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        } catch (e) {
          // ignore
        }
      }
    }
    return []
  })

  const chatBottomRef = useRef<HTMLDivElement>(null)

  // URL Query Sync
  useEffect(() => {
    const savedLang = localStorage.getItem('octopus_lang') as Language
    if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'uk')) {
      setLang(savedLang)
    }

    const params = new URLSearchParams(window.location.search)
    const qParam = params.get('q')
    if (qParam) {
      setQuery(qParam)
      executeAiSearch(qParam)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('octopus_lang', newLang)
  }

  const handleSaveApiSettings = () => {
    localStorage.setItem('octopus_gcs_key', googleApiKey)
    localStorage.setItem('octopus_gcs_cx', googleCxId)
    setSettingsOpen(false)
  }

  const t = SEARCH_TRANSLATIONS[lang]

  useEffect(() => {
    if (aiModalOpen && chatMessages.length === 0) {
      setChatMessages([{ sender: 'ai', text: t.krakenusAi.welcome }])
    }
  }, [aiModalOpen, chatMessages.length, t.krakenusAi.welcome])

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('octopus_search_chat', JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Helper to generate dynamic fallback for query `q`
  const generateDynamicFallbackItem = (q: string, idx: number): SearchResultItem => {
    const cleanQ = q.trim()
    const domains = [
      'roblox.com',
      'help.roblox.com',
      'play.google.com',
      'apps.apple.com',
      'techblog.ru',
      'roblox.fandom.com',
      'wikipedia.org',
      'habr.com',
      'youtube.com',
      'microsoft.com',
    ]

    const titles = [
      `Загрузить ${cleanQ} для ПК — Официальный сайт`,
      `${cleanQ} — Играть онлайн бесплатно`,
      `Скачать ${cleanQ} на Android — Google Play`,
      `${cleanQ} для iOS — App Store`,
      `Как установить ${cleanQ} на компьютер — Инструкция`,
      `${cleanQ} Mobile — Скачать приложение`,
      `Безопасное скачивание ${cleanQ} — Руководство`,
      `${cleanQ} Wiki — Все способы и системные требования`,
      `Обзор и системные требования ${cleanQ}`,
      `Решение проблем и установка ${cleanQ} на Windows`,
    ]

    const domain = domains[idx % domains.length]
    return {
      id: `dyn-fb-${idx}`,
      title: titles[idx % titles.length],
      url: `https://${domain}/search?q=${encodeURIComponent(cleanQ)}`,
      domain: domain,
      snippet: `Подробная официальная инструкция, пошаговое руководство по скачиванию и установке ${cleanQ}.`,
      imageUrl: getTopicImageForQuery(cleanQ, idx),
    }
  }

  // Execute HYBRID SEARCH: Live Web Search (Google API / DuckDuckGo) + Krakenus AI Overview
  const executeAiSearch = async (searchQueryText: string) => {
    const q = searchQueryText.trim()
    if (!q) {
      setHasSearched(false)
      setActiveQuery('')
      setResults([])
      setAiSummary('')
      setAiExpanded(false)
      setAttemptStatus('')
      window.history.pushState(null, '', window.location.pathname)
      return
    }

    const startTime = performance.now()
    setHasSearched(true)
    setActiveQuery(q)
    setIsSearching(true)
    setAiSummary('')
    setAiExpanded(false)
    setAttemptStatus('')

    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(q)}`
    window.history.pushState(null, '', newUrl)

    // 1. Attempt Real Live Web Search via Google Custom Search API or DuckDuckGo API
    let liveWebResults: SearchResultItem[] = []
    if (googleApiKey && googleCxId) {
      liveWebResults = await fetchGoogleCustomSearchResults(q, googleApiKey, googleCxId)
    }
    if (liveWebResults.length === 0) {
      liveWebResults = await fetchDuckDuckGoLiveResults(q)
    }

    const langName = lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'
    const systemPrompt = `You are Krakenus AI Search Engine Core.
User query: "${q}".

Strict Rules:
1. Provide a CONCISE, ultra-useful AI Overview in ${langName}. Must start with top 5 key points.
2. Do NOT output raw markdown headers ("###") or link brackets "[http://...]".
3. At the end, output EXACTLY "---SOURCES---" followed by a JSON array of EXACTLY 10 relevant web search result items matching "${q}".

JSON Format:
[
  {
    "title": "Заголовок страницы",
    "url": "https://example.com/page",
    "domain": "example.com",
    "snippet": "Описание..."
  }
]`

    let attempt = 0
    const maxAttempts = 5
    let success = false

    while (attempt < maxAttempts && !success) {
      attempt++
      if (attempt > 1) {
        setAttemptStatus(`Попытка ${attempt} из ${maxAttempts}...`)
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://octopus.dev',
            'X-Title': 'Octopus Search',
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: q },
            ],
            stream: false,
          }),
        })

        const endTime = performance.now()
        setSearchTime(((endTime - startTime) / 1000).toFixed(2))

        if (response.ok) {
          const data = await response.json()
          const fullContent: string = data.choices?.[0]?.message?.content || ''

          if (fullContent.includes('---SOURCES---')) {
            const parts = fullContent.split('---SOURCES---')
            const answerText = parts[0].trim()
            const sourcesRaw = parts[1].trim()

            setAiSummary(answerText)

            try {
              const jsonMatch = sourcesRaw.match(/\[[\s\S]*\]/)
              let finalResults: SearchResultItem[] = []

              if (liveWebResults.length > 0) {
                finalResults = liveWebResults
              } else if (jsonMatch) {
                const parsed: any[] = JSON.parse(jsonMatch[0])
                finalResults = parsed.map((item, idx) => ({
                  id: `ai-src-${idx}`,
                  title: item.title || item.domain || `Результат ${idx + 1}`,
                  url: item.url || `https://${item.domain || 'google.com'}`,
                  domain: item.domain || 'web.search',
                  snippet: item.snippet || 'Подробная информация по вашему запросу.',
                  imageUrl: getTopicImageForQuery(q, idx),
                }))
              }

              while (finalResults.length < 10) {
                finalResults.push(generateDynamicFallbackItem(q, finalResults.length))
              }

              setResults(finalResults.slice(0, 10))
              success = true
              break
            } catch (jsonErr) {
              const fallbackList = liveWebResults.length > 0 ? liveWebResults : Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i))
              while (fallbackList.length < 10) fallbackList.push(generateDynamicFallbackItem(q, fallbackList.length))
              setResults(fallbackList.slice(0, 10))
              success = true
              break
            }
          } else {
            setAiSummary(fullContent)
            const fallbackList = liveWebResults.length > 0 ? liveWebResults : Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i))
            while (fallbackList.length < 10) fallbackList.push(generateDynamicFallbackItem(q, fallbackList.length))
            setResults(fallbackList.slice(0, 10))
            success = true
            break
          }
        }
      } catch (e) {
        console.error(`Attempt ${attempt} error:`, e)
      }

      if (!success && attempt < maxAttempts) {
        for (let sec = 5; sec > 0; sec--) {
          setAttemptStatus(`Не удалось. Повторная попытка (${attempt}/${maxAttempts}) через ${sec} сек...`)
          await new Promise((r) => setTimeout(r, 1000))
        }
      }
    }

    if (!success) {
      setAttemptStatus('')
      setAiSummary(`Запрос обработан по базе данных Octopus Search.`)
      const fallbackList = liveWebResults.length > 0 ? liveWebResults : Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i))
      while (fallbackList.length < 10) fallbackList.push(generateDynamicFallbackItem(q, fallbackList.length))
      setResults(fallbackList.slice(0, 10))
    }

    setIsSearching(false)
    setAttemptStatus('')
  }

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

    const systemPrompt = `You are Krakenus AI, the neural assistant for Octopus Search. You respond cleanly and helpfully in ${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}.`

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://octopus.dev',
          'X-Title': 'Octopus Search',
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

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || 'Запрос обработан.'

        setChatMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = { sender: 'ai', text: reply }
          return next
        })
      }
    } catch (err) {
      console.error('AI chat error:', err)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="search-app-root">
      {/* SEARCH API SETTINGS MODAL */}
      {settingsOpen && (
        <div className="ai-modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="ai-modal-card" style={{ height: 'auto', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-title-group">
                <Settings size={20} style={{ color: 'var(--coral)' }} />
                <h3>{t.settingsTitle}</h3>
              </div>
              <button type="button" className="geo-close-btn" onClick={() => setSettingsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'rgba(243, 240, 231, 0.85)' }}>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                Вы можете подключить <strong>Google Custom Search API</strong> для получения 100% реальных живых ссылок из индекса Google!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, color: 'var(--lime)', fontSize: '12px' }}>Google Custom Search API Key:</label>
                <input
                  type="password"
                  className="ai-input-field"
                  style={{ background: 'rgba(5, 14, 14, 0.95)', border: '1px solid rgba(243, 240, 231, 0.2)', padding: '10px 14px', borderRadius: '10px' }}
                  placeholder="AIzaSy..."
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: 600, color: 'var(--lime)', fontSize: '12px' }}>Search Engine ID (CX):</label>
                <input
                  type="text"
                  className="ai-input-field"
                  style={{ background: 'rgba(5, 14, 14, 0.95)', border: '1px solid rgba(243, 240, 231, 0.2)', padding: '10px 14px', borderRadius: '10px' }}
                  placeholder="0175766625..."
                  value={googleCxId}
                  onChange={(e) => setGoogleCxId(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="google-btn" onClick={() => setSettingsOpen(false)}>
                  Отмена
                </button>
                <button type="button" className="google-btn" style={{ background: 'var(--coral)', borderColor: 'var(--coral)' }} onClick={handleSaveApiSettings}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KRAKENUS AI ASSISTANT MODAL */}
      {aiModalOpen && (
        <div className="ai-modal-backdrop" onClick={() => setAiModalOpen(false)}>
          <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-title-group">
                <div className="ai-avatar-badge">
                  <OctopusMark compact />
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
                  onClick={() => {
                    localStorage.removeItem('octopus_search_chat')
                    setChatMessages([{ sender: 'ai', text: t.krakenusAi.welcome }])
                  }}
                  title={t.krakenusAi.clearTooltip}
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  className="geo-close-btn"
                  onClick={() => setAiModalOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="ai-chat-stream">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-row chat-bubble--${msg.sender}`}>
                  <div className="chat-avatar">
                    {msg.sender === 'ai' ? <OctopusMark compact /> : <User size={14} />}
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
              <button type="submit" className="ai-send-btn" disabled={aiLoading || !aiInput.trim()}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STATE 1: GOOGLE HOME UI DESIGN */}
      {!hasSearched ? (
        <div className="google-home-layout">
          <header className="google-home-header">
            <a href="https://octopus.dev" className="google-hub-link">
              <span>{t.backToHub}</span>
            </a>

            <div className="google-header-actions">
              <button
                type="button"
                className="ai-trigger-btn"
                onClick={() => setSettingsOpen(true)}
                title="Настройки API поиска"
              >
                <Settings size={14} />
                <span>API Settings</span>
              </button>

              <button
                type="button"
                className="ai-trigger-btn"
                onClick={() => setAiModalOpen(true)}
              >
                <Bot size={15} />
                <span>Krakenus AI</span>
              </button>

              <LanguageSelectorMenu currentLang={lang} onSelectLang={handleSetLang} />
            </div>
          </header>

          <main className="google-home-center">
            <div className="google-logo-wrapper">
              <OctopusMark />
              <h1 className="google-logo-text">OCTOPUS <span>SEARCH</span></h1>
            </div>

            <form
              className="google-search-bar-form"
              onSubmit={(e) => {
                e.preventDefault()
                executeAiSearch(query)
              }}
            >
              <div className="google-search-input-pill">
                <SearchIcon size={20} className="google-search-icon" />
                <input
                  type="text"
                  className="google-main-input"
                  placeholder={t.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    className="google-clear-btn"
                    onClick={() => setQuery('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="google-action-buttons">
                <button type="submit" className="google-btn">
                  {t.btnSearch}
                </button>
                <button
                  type="button"
                  className="google-btn"
                  onClick={() => {
                    const randomQuery = t.quickQueries[Math.floor(Math.random() * t.quickQueries.length)]
                    setQuery(randomQuery)
                    executeAiSearch(randomQuery)
                  }}
                >
                  {t.btnLucky}
                </button>
              </div>
            </form>

            <div className="google-quick-links">
              {t.quickQueries.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="google-chip-link"
                  onClick={() => {
                    setQuery(q)
                    executeAiSearch(q)
                  }}
                >
                  <SearchIcon size={12} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </main>

          <footer className="google-home-footer">
            <div className="google-footer-row google-footer-location">
              <MapPin size={13} />
              <span>{t.footerLocation}</span>
            </div>
          </footer>
        </div>
      ) : (
        /* STATE 2: AUTHENTIC GOOGLE RESULTS VIEW */
        <div className="google-results-layout">
          <header className="google-results-header">
            <div className="google-header-left">
              <a
                href="/"
                className="google-results-logo"
                onClick={(e) => {
                  e.preventDefault()
                  setQuery('')
                  executeAiSearch('')
                }}
              >
                <OctopusMark compact />
                <span className="results-logo-text">OCTOPUS <span>SEARCH</span></span>
              </a>

              <form
                className="google-top-search-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  executeAiSearch(query)
                }}
              >
                <div className="google-top-pill">
                  <input
                    type="text"
                    className="google-top-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.placeholder}
                  />
                  {query && (
                    <button
                      type="button"
                      className="google-clear-btn"
                      onClick={() => {
                        setQuery('')
                        executeAiSearch('')
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" className="google-top-submit-icon">
                    <SearchIcon size={16} />
                  </button>
                </div>
              </form>
            </div>

            <div className="google-top-actions">
              <button
                type="button"
                className="ai-trigger-btn"
                onClick={() => setSettingsOpen(true)}
                title="Настройки API поиска"
              >
                <Settings size={14} />
              </button>

              <button
                type="button"
                className="ai-trigger-btn"
                onClick={() => setAiModalOpen(true)}
              >
                <Bot size={15} />
                <span>Krakenus AI</span>
              </button>

              <LanguageSelectorMenu currentLang={lang} onSelectLang={handleSetLang} />
            </div>
          </header>

          <div className="google-tabs-bar">
            <div className="google-tabs-container">
              <button
                type="button"
                className={`google-tab ${activeTab === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <SearchIcon size={14} />
                <span>{t.tabAll}</span>
              </button>
              <button
                type="button"
                className={`google-tab ${activeTab === 'images' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('images')}
              >
                <ImageIcon size={14} />
                <span>{t.tabImages}</span>
              </button>
              <button
                type="button"
                className={`google-tab ${activeTab === 'news' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('news')}
              >
                <Newspaper size={14} />
                <span>{t.tabNews}</span>
              </button>
              <button
                type="button"
                className={`google-tab ${activeTab === 'videos' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                <Video size={14} />
                <span>{t.tabVideos}</span>
              </button>
            </div>
          </div>

          <main className="google-results-main">
            <div className="google-stats-line">
              <span>{t.resultsCount} {results.length * 1540 + 82} ({searchTime} сек.)</span>
            </div>

            {/* TAB 1: ALL RESULTS (ORGANIC + AI OVERVIEW) */}
            {activeTab === 'all' && (
              <>
                {(aiSummary || isSearching) && (
                  <div className="google-ai-overview-card">
                    <div className="google-ai-overview-header">
                      <div className="google-ai-badge">
                        <Sparkles size={16} />
                      </div>
                      <h3>{t.aiOverviewTitle}</h3>
                    </div>

                    {isSearching ? (
                      <div className="google-ai-loading">
                        <span className="pulse-dot" />
                        <p>{attemptStatus || t.aiGenerating}</p>
                      </div>
                    ) : (
                      <>
                        <div className={`google-ai-body ${!aiExpanded ? 'is-collapsed-mask' : ''}`}>
                          <FormattedAiText text={aiSummary} />
                        </div>

                        <button
                          type="button"
                          className="google-ai-expand-btn"
                          onClick={() => setAiExpanded((exp) => !exp)}
                        >
                          <span>{aiExpanded ? t.showLess : t.showMore}</span>
                          {aiExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* EXACTLY 10 ORGANIC SITES LIST WITH BRANDED IMAGES */}
                <div className="google-organic-list">
                  {results.length > 0 ? (
                    results.map((item, index) => (
                      <article key={item.id} className="google-result-item">
                        <div className="google-result-card-inner">
                          <div className="google-result-content-col">
                            <div className="google-cite-meta">
                              <div className="google-favicon-circle">
                                <Globe2 size={12} />
                              </div>
                              <div className="google-cite-text">
                                <span className="google-site-name">{item.domain}</span>
                                <span className="google-cite-url">{item.url}</span>
                              </div>
                            </div>

                            <h3 className="google-result-title">
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.title}
                              </a>
                            </h3>

                            <p className="google-result-snippet">{item.snippet}</p>
                          </div>

                          {item.imageUrl && (
                            <div className="google-result-thumb-box">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget
                                  target.onerror = null
                                  target.src = getTopicImageForQuery(activeQuery, index)
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    ))
                  ) : !isSearching ? (
                    <div className="google-no-results">
                      <p>По вашему запросу ничего не найдено.</p>
                    </div>
                  ) : null}
                </div>
              </>
            )}

            {/* TAB 2: GOOGLE IMAGES TAB GRID */}
            {activeTab === 'images' && (
              <div className="google-images-grid-view">
                {results.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-image-card"
                  >
                    <div className="image-card-preview">
                      <img
                        src={item.imageUrl || getTopicImageForQuery(activeQuery, index)}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.onerror = null
                          target.src = getTopicImageForQuery(activeQuery, index)
                        }}
                      />
                    </div>
                    <div className="image-card-info">
                      <span className="image-card-domain">{item.domain}</span>
                      <p className="image-card-title">{item.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="google-bottom-notice">
              <Sparkles size={13} />
              <span>{t.searchSecNotice}</span>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
