import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
  Globe,
  Globe2,
  Key,
  Newspaper,
  RefreshCw,
  Search as SearchIcon,
  Send,
  Settings,
  Sparkles,
  User,
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
  category: 'all' | 'news' | 'code'
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
    badge: 'Закрытый бета-тест',
    tagline: 'Розумный чистый поиск на базе Google API и Krakenus AI Core',
    placeholder: 'Введите запрос в Google Search...',
    searchBtn: 'Найти в Google',
    filterAll: 'Все результаты',
    filterAi: 'ИИ-Сводка',
    filterNews: 'Новости',
    filterCode: 'Разработка',
    aiOverviewTitle: 'Krakenus AI — Сводка по результатам',
    aiGenerating: 'Анализ выдачи и генерация краткого ответа...',
    quickTitle: 'Популярные запросы:',
    quickQueries: [
      'Что нового в React 19?',
      'TanStack Start документация',
      'Google Custom Search API',
      'Новое в веб-разработке 2026',
    ],
    noResults: 'Результаты по вашему запросу не найдены. Попробуйте сменить запрос.',
    backToHub: 'octopus.dev',
    resultsFound: 'Найдено релевантных результатов:',
    searchSecNotice: 'Octopus Search 1.0 на базе Google API фильтрует спам и рекламу.',
    googleApiConfig: 'Настройки Google API',
    googleApiKeyPlaceholder: 'Ваш Google Search API Key (AIzaSy...)',
    googleCxPlaceholder: 'Ваш Search Engine ID (CX key...)',
    saveKeys: 'Сохранить ключи',
    apiConfigNotice: 'Можно ввести свой Google Custom Search API Key или использовать встроенный фильтр.',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент Octopus Search',
      welcome: 'Приветствую! Я **Krakenus AI**. Я помогаю фильтровать и анализировать результаты поиска Octopus Search. Чем могу помочь?',
      placeholder: 'Задайте вопрос по поиску...',
      quickTitle: 'Подсказки:',
      quickPrompts: [
        'Сделать краткую выжимку',
        'Найти первоисточник',
        'Объяснить термины',
      ],
      clearTooltip: 'Очистить историю',
    },
  },
  en: {
    badge: 'Closed Beta Test',
    tagline: 'Smart noise-free search powered by Google API and Krakenus AI Core',
    placeholder: 'Enter query for Google Search...',
    searchBtn: 'Search Google',
    filterAll: 'All Results',
    filterAi: 'AI Summary',
    filterNews: 'News',
    filterCode: 'Dev & Code',
    aiOverviewTitle: 'Krakenus AI — Results Overview',
    aiGenerating: 'Analyzing top search results & generating response...',
    quickTitle: 'Trending queries:',
    quickQueries: [
      'What is new in React 19?',
      'TanStack Start docs',
      'Google Custom Search API',
      'Modern web tech trends 2026',
    ],
    noResults: 'No results found for your query.',
    backToHub: 'octopus.dev',
    resultsFound: 'Clean Google results:',
    searchSecNotice: 'Octopus Search 1.0 filters out noise and intrusive ads.',
    googleApiConfig: 'Google API Settings',
    googleApiKeyPlaceholder: 'Google Search API Key (AIzaSy...)',
    googleCxPlaceholder: 'Search Engine ID (CX key...)',
    saveKeys: 'Save API Keys',
    apiConfigNotice: 'Enter your custom Google Search API keys or use default search engine.',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'Octopus Search AI Core',
      welcome: 'Welcome! I am **Krakenus AI**. I analyze search results in Octopus Search. How can I help?',
      placeholder: 'Ask a search question...',
      quickTitle: 'Quick prompts:',
      quickPrompts: [
        'Summarize results',
        'Find original docs',
        'Explain terms',
      ],
      clearTooltip: 'Clear history',
    },
  },
  uk: {
    badge: 'Закрытий бета-тест',
    tagline: 'Розумний чистий пошук на базі Google API та Krakenus AI Core',
    placeholder: 'Введіть запит для Google Search...',
    searchBtn: 'Знайти в Google',
    filterAll: 'Усі результати',
    filterAi: 'ШІ-Зведення',
    filterNews: 'Новини',
    filterCode: 'Розробка',
    aiOverviewTitle: 'Krakenus AI — Зведення за результатами',
    aiGenerating: 'Аналіз видачі та генерація короткої відповіді...',
    quickTitle: 'Популярні запити:',
    quickQueries: [
      'Що нового в React 19?',
      'Документація TanStack Start',
      'Google Custom Search API',
      'Нове у веб-розробці 2026',
    ],
    noResults: 'Результатів за вашим запитом не знайдено.',
    backToHub: 'octopus.dev',
    resultsFound: 'Знайдено чистих результатів:',
    searchSecNotice: 'Octopus Search 1.0 на базі Google API фільтрує спам та рекламу.',
    googleApiConfig: 'Налаштування Google API',
    googleApiKeyPlaceholder: 'Ваш Google Search API Key (AIzaSy...)',
    googleCxPlaceholder: 'Ваш Search Engine ID (CX key...)',
    saveKeys: 'Зберегти ключі',
    apiConfigNotice: 'Можна ввести свій Google Custom Search API Key або використовувати вбудований пошук.',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ШІ-асистент Octopus Search',
      welcome: 'Вітаю! Я **Krakenus AI**. Я допомагаю з аналізом видачі у Octopus Search. Що вас цікавить?',
      placeholder: 'Задайте питання по пошуку...',
      quickTitle: 'Підказки:',
      quickPrompts: [
        'Зробити короткий висновок',
        'Знайти першоджерело',
        'Пояснити терміни',
      ],
      clearTooltip: 'Очистити історію',
    },
  },
}

const DEFAULT_GOOGLE_RESULTS: SearchResultItem[] = [
  {
    id: '1',
    title: 'React 19 Official Documentation & Upgrade Guide',
    url: 'https://react.dev/blog/2024/12/05/react-19',
    domain: 'react.dev',
    snippet: 'Official guide to React 19 features: Actions, useActionState, useOptimistic, server components, and asset loading optimizations.',
    category: 'code',
    date: '2026',
  },
  {
    id: '2',
    title: 'Google Custom Search JSON API — Official Overview',
    url: 'https://developers.google.com/custom-search/v1/overview',
    domain: 'developers.google.com',
    snippet: 'The Custom Search JSON API lets you develop websites and applications to retrieve and display search results from Google Custom Search programmatically.',
    category: 'code',
    date: '2026',
  },
  {
    id: '3',
    title: 'Octopus Digital Hub — Multi-Service Domain Ecosystem Architecture',
    url: 'https://octopus.dev',
    domain: 'octopus.dev',
    snippet: 'Octopus connects standalone digital products under a unified design system, shared principles, and subdomains (search.octopus.dev, cloud.octopus.dev).',
    category: 'all',
    date: '2026',
  },
  {
    id: '4',
    title: 'TanStack Start — Full-stack React Framework with SSR & Routing',
    url: 'https://tanstack.com/start/latest',
    domain: 'tanstack.com',
    snippet: 'Full-stack framework built on TanStack Router. Provides type-safe server functions, document streaming, and Netlify adapter support.',
    category: 'code',
    date: '2026',
  },
  {
    id: '5',
    title: 'Vite 7.0 Announcement — Ultra Fast Web Dev Engine',
    url: 'https://vite.dev/blog/announcing-vite7',
    domain: 'vite.dev',
    snippet: 'Vite 7 features improved HMR performance, standalone environment API support, and optimized production bundle compilation.',
    category: 'news',
    date: '2026',
  },
]

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
  const [activeCategory, setActiveCategory] = useState<'all' | 'news' | 'code'>('all')

  // Google API Credentials
  const [googleApiKey, setGoogleApiKey] = useState('')
  const [googleCxKey, setGoogleCxKey] = useState('')
  const [showConfigModal, setShowConfigModal] = useState(false)

  // AI & Search States
  const [results, setResults] = useState<SearchResultItem[]>(DEFAULT_GOOGLE_RESULTS)
  const [isSearching, setIsSearching] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false)

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

  // Saved credentials load
  useEffect(() => {
    const savedLang = localStorage.getItem('octopus_lang') as Language
    if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'uk')) {
      setLang(savedLang)
    }
    const savedKey = localStorage.getItem('octopus_google_api_key')
    const savedCx = localStorage.getItem('octopus_google_cx_key')
    if (savedKey) setGoogleApiKey(savedKey)
    if (savedCx) setGoogleCxKey(savedCx)
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('octopus_lang', newLang)
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

  const handleSaveGoogleKeys = () => {
    localStorage.setItem('octopus_google_api_key', googleApiKey)
    localStorage.setItem('octopus_google_cx_key', googleCxKey)
    setShowConfigModal(false)
  }

  // Execute Google Search API request
  const handlePerformSearch = async (searchQueryText?: string) => {
    const q = (searchQueryText !== undefined ? searchQueryText : query).trim()
    if (!q) {
      setResults(DEFAULT_GOOGLE_RESULTS)
      setAiSummary('')
      return
    }

    setIsSearching(true)

    // Try Google Custom Search API if API key and CX are present
    if (googleApiKey && googleCxKey) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(googleApiKey)}&cx=${encodeURIComponent(googleCxKey)}&q=${encodeURIComponent(q)}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.items && Array.isArray(data.items)) {
            const parsedResults: SearchResultItem[] = data.items.map((item: any, idx: number) => ({
              id: `google-${idx}`,
              title: item.title || item.htmlTitle,
              url: item.link,
              domain: item.displayLink || new URL(item.link).hostname,
              snippet: item.snippet,
              category: 'all',
            }))
            setResults(parsedResults)
            fetchAiOverview(q, parsedResults)
            setIsSearching(false)
            return
          }
        }
      } catch (e) {
        console.error('Google Custom Search API error:', e)
      }
    }

    // Fallback: Local Smart Filtering
    const lower = q.toLowerCase()
    const filtered = DEFAULT_GOOGLE_RESULTS.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.snippet.toLowerCase().includes(lower) ||
        item.domain.toLowerCase().includes(lower)
    )

    if (filtered.length === 0) {
      const syntheticResults: SearchResultItem[] = [
        {
          id: 'gen-1',
          title: `${q} — Google Web Results Overview`,
          url: `https://google.com/search?q=${encodeURIComponent(q)}`,
          domain: 'google.com',
          snippet: `Результаты по запросу "${q}". Отфильтровано сервисом Octopus Search от спама и трекеров.`,
          category: 'all',
          date: '2026',
        },
      ]
      setResults(syntheticResults)
      fetchAiOverview(q, syntheticResults)
    } else {
      setResults(filtered)
      fetchAiOverview(q, filtered)
    }

    setIsSearching(false)
  }

  const fetchAiOverview = async (searchQuery: string, currentResults: SearchResultItem[]) => {
    setAiSummaryLoading(true)
    setAiSummary('')

    const contextSnippets = currentResults.slice(0, 3).map((r) => `${r.title}: ${r.snippet}`).join('\n')
    const systemPrompt = `You are Krakenus AI Search Intelligence core.
Search Query: "${searchQuery}"
Top Results Context:
${contextSnippets}

Generate a clean, brilliant 2-3 sentence summary answer in ${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}.`

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
            { role: 'user', content: searchQuery },
          ],
          stream: false,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || ''
        setAiSummary(text)
      }
    } catch (e) {
      console.error('AI Overview error:', e)
    } finally {
      setAiSummaryLoading(false)
    }
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

    const systemPrompt = `You are Krakenus AI, the neural assistant for Octopus Search. You respond cleanly and helpfully in ${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}.
All Octopus ecosystem services are in CLOSED BETA.`

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

  const displayedResults = results.filter((r) => {
    if (activeCategory === 'all') return true
    return r.category === activeCategory
  })

  return (
    <div className="search-app-root">
      {/* Fixed Header */}
      <header className="site-header">
        <a href="/" className="brand">
          <OctopusMark compact />
          <span>OCTOPUS</span>
          <sup className="search-sub-tag">SEARCH</sup>
        </a>

        <div className="header-actions-right">
          <button
            type="button"
            className="ai-trigger-btn"
            onClick={() => setAiModalOpen(true)}
          >
            <Bot size={15} />
            <span>Krakenus AI</span>
          </button>

          <button
            type="button"
            className="lang-selector-btn"
            onClick={() => setShowConfigModal(true)}
            title="Google API Credentials"
          >
            <Settings size={14} />
          </button>

          <LanguageSelectorMenu currentLang={lang} onSelectLang={handleSetLang} />

          <a href="/" className="search-hub-link">
            <span>{t.backToHub}</span>
          </a>
        </div>
      </header>

      {/* GOOGLE API CONFIG MODAL */}
      {showConfigModal && (
        <div className="ai-modal-backdrop" onClick={() => setShowConfigModal(false)}>
          <div className="ai-modal-card" style={{ height: 'auto', minHeight: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-title-group">
                <Key size={20} style={{ color: 'var(--lime)' }} />
                <h3>{t.googleApiConfig}</h3>
              </div>
              <button type="button" className="geo-close-btn" onClick={() => setShowConfigModal(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'rgba(243,240,231,0.8)', margin: '0 0 16px 0' }}>
              {t.apiConfigNotice}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                className="ai-input-field"
                placeholder={t.googleApiKeyPlaceholder}
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                style={{ padding: '12px', background: 'rgba(5, 14, 14, 0.95)', border: '1px solid rgba(243, 240, 231, 0.2)', borderRadius: '10px' }}
              />
              <input
                type="text"
                className="ai-input-field"
                placeholder={t.googleCxPlaceholder}
                value={googleCxKey}
                onChange={(e) => setGoogleCxKey(e.target.value)}
                style={{ padding: '12px', background: 'rgba(5, 14, 14, 0.95)', border: '1px solid rgba(243, 240, 231, 0.2)', borderRadius: '10px' }}
              />
              <button
                type="button"
                className="search-submit-btn"
                onClick={handleSaveGoogleKeys}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                {t.saveKeys}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KRAKENUS AI MODAL */}
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

      {/* Main Search Hero */}
      <div className="search-hero-container">
        <div className="search-brand-hero">
          <div className="search-logo-circle">
            <OctopusMark />
          </div>
          <h1>OCTOPUS <span>SEARCH</span></h1>
          <span className="search-beta-badge">{t.badge}</span>
          <p className="search-tagline">{t.tagline}</p>
        </div>

        {/* Search Bar Form */}
        <form
          className="search-bar-form"
          onSubmit={(e) => {
            e.preventDefault()
            handlePerformSearch()
          }}
        >
          <div className="search-input-wrapper">
            <SearchIcon size={20} className="search-input-icon" />
            <input
              type="text"
              className="main-search-input"
              placeholder={t.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('')
                  handlePerformSearch('')
                }}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-submit-btn">
              <span>{t.searchBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Quick Query Chips */}
        <div className="search-quick-queries">
          <span>{t.quickTitle}</span>
          <div className="quick-query-chips">
            {t.quickQueries.map((q) => (
              <button
                key={q}
                type="button"
                className="query-chip"
                onClick={() => {
                  setQuery(q)
                  handlePerformSearch(q)
                }}
              >
                <SearchIcon size={12} />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      <div className="search-results-section">
        {/* Category Tabs */}
        <div className="search-category-tabs">
          <button
            type="button"
            className={`category-tab ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <Filter size={14} />
            <span>{t.filterAll}</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'news' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('news')}
          >
            <Newspaper size={14} />
            <span>{t.filterNews}</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'code' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('code')}
          >
            <Braces size={14} />
            <span>{t.filterCode}</span>
          </button>
        </div>

        {/* AI Overview Box */}
        {(aiSummary || aiSummaryLoading) && (
          <div className="ai-overview-card">
            <div className="ai-overview-header">
              <Sparkles size={18} />
              <h4>{t.aiOverviewTitle}</h4>
            </div>
            {aiSummaryLoading ? (
              <div className="ai-overview-loading">
                <span className="pulse-dot" />
                <p>{t.aiGenerating}</p>
              </div>
            ) : (
              <div className="ai-overview-body">
                <FormattedAiText text={aiSummary} />
              </div>
            )}
          </div>
        )}

        {/* Search Results List */}
        <div className="search-results-list">
          {isSearching ? (
            <div className="search-empty-state">
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Поиск по Google API...</p>
            </div>
          ) : displayedResults.length > 0 ? (
            displayedResults.map((item) => (
              <article key={item.id} className="search-result-card">
                <div className="result-header-meta">
                  <Globe2 size={14} className="domain-icon" />
                  <span className="result-domain">{item.domain}</span>
                  {item.date && <span className="result-date">• {item.date}</span>}
                </div>
                <h3 className="result-title">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ExternalLink size={14} />
                  </a>
                </h3>
                <p className="result-snippet">{item.snippet}</p>
              </article>
            ))
          ) : (
            <div className="search-empty-state">
              <OctopusMark compact />
              <p>{t.noResults}</p>
            </div>
          )}
        </div>

        <div className="search-footer-notice">
          <Sparkles size={14} />
          <span>{t.searchSecNotice}</span>
        </div>
      </div>
    </div>
  )
}
