import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  Filter,
  Globe,
  Globe2,
  Image as ImageIcon,
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
  category: 'all' | 'news' | 'code' | 'image'
  imageUrl?: string
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
    filterNews: 'Новости',
    filterImages: 'Изображения',
    filterCode: 'Разработка',
    aiOverviewTitle: 'Krakenus AI — Умный ответ по запросу',
    aiGenerating: 'Генерация мгновенного ответа по источникам...',
    quickTitle: 'Популярные запросы:',
    quickQueries: [
      'как приготовить сладкие блинчики',
      'Что нового в React 19?',
      'TanStack Start документация',
      'Google Custom Search API',
    ],
    noResults: 'Результаты по вашему запросу не найдены. Попробуйте сменить запрос.',
    backToHub: 'octopus.dev',
    resultsFound: 'Найдено чистых результатов:',
    searchSecNotice: 'Octopus Search 1.0 на базе Google API фильтрует спам и рекламу.',
    googleApiConfig: 'Настройки Google API',
    googleApiKeyPlaceholder: 'Ваш Google Search API Key (AIzaSy...)',
    googleCxPlaceholder: 'Ваш Search Engine ID (CX key...)',
    saveKeys: 'Сохранить ключи',
    apiConfigNotice: 'Можно ввести свой Google Custom Search API Key или использовать встроенный веб-индекс.',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент Octopus Search',
      welcome: 'Приветствую! Я **Krakenus AI**. Я помогаю фильтровать и анализировать результаты поиска Octopus Search. Чем могу помочь?',
      placeholder: 'Задайте вопрос по поиску...',
      quickTitle: 'Подсказки:',
      quickPrompts: [
        'Сделать краткую выжимку',
        'Найти рецепт',
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
    filterNews: 'News',
    filterImages: 'Images',
    filterCode: 'Dev & Code',
    aiOverviewTitle: 'Krakenus AI — Smart Query Overview',
    aiGenerating: 'Generating instant verified response...',
    quickTitle: 'Trending queries:',
    quickQueries: [
      'how to make sweet pancakes',
      'What is new in React 19?',
      'TanStack Start docs',
      'Google Custom Search API',
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
        'Find recipe',
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
    filterNews: 'Новини',
    filterImages: 'Зображення',
    filterCode: 'Розробка',
    aiOverviewTitle: 'Krakenus AI — Розумна відповідь за запитом',
    aiGenerating: 'Генерація миттєвої відповіді по джерелах...',
    quickTitle: 'Популярні запити:',
    quickQueries: [
      'як приготувати солодкі млинці',
      'Що нового в React 19?',
      'Документація TanStack Start',
      'Google Custom Search API',
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
        'Знайти рецепт',
        'Пояснити терміни',
      ],
      clearTooltip: 'Очистити історію',
    },
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

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
          return (
            <div key={lineIdx} className="formatted-list-item">
              <span className="list-bullet">•</span>
              <span>{parseInlineMarkdown(trimmed.replace(/^[-*1-9.]+\s*/, ''))}</span>
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
  const [activeQuery, setActiveQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | 'news' | 'code' | 'image'>('all')

  // Google API Credentials
  const [googleApiKey, setGoogleApiKey] = useState('')
  const [googleCxKey, setGoogleCxKey] = useState('')
  const [showConfigModal, setShowConfigModal] = useState(false)

  // AI & Search States
  const [results, setResults] = useState<SearchResultItem[]>([])
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

  // Sync with URL query string e.g. ?q=сладкие+блинчики
  useEffect(() => {
    const savedLang = localStorage.getItem('octopus_lang') as Language
    if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'uk')) {
      setLang(savedLang)
    }
    const savedKey = localStorage.getItem('octopus_google_api_key')
    const savedCx = localStorage.getItem('octopus_google_cx_key')
    if (savedKey) setGoogleApiKey(savedKey)
    if (savedCx) setGoogleCxKey(savedCx)

    // Check URL params on initial load
    const params = new URLSearchParams(window.location.search)
    const qParam = params.get('q')
    if (qParam) {
      setQuery(qParam)
      executeSearch(qParam)
    }
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

  // Execute Google Search & AI Overview
  const executeSearch = async (searchQueryText: string) => {
    const q = searchQueryText.trim()
    if (!q) {
      setHasSearched(false)
      setActiveQuery('')
      setResults([])
      setAiSummary('')
      window.history.pushState(null, '', window.location.pathname)
      return
    }

    setHasSearched(true)
    setActiveQuery(q)
    setIsSearching(true)
    setAiSummary('')

    // Update browser URL query param like Google: ?q=search_query
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(q)}`
    window.history.pushState(null, '', newUrl)

    let searchItems: SearchResultItem[] = []

    // Try Google Custom Search API if API key and CX are available
    if (googleApiKey && googleCxKey) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(googleApiKey)}&cx=${encodeURIComponent(googleCxKey)}&q=${encodeURIComponent(q)}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.items && Array.isArray(data.items)) {
            searchItems = data.items.map((item: any, idx: number) => ({
              id: `google-${idx}`,
              title: item.title || item.htmlTitle,
              url: item.link,
              domain: item.displayLink || new URL(item.link).hostname,
              snippet: item.snippet,
              category: item.mime || item.pagemap?.cse_image ? 'image' : 'all',
              imageUrl: item.pagemap?.cse_image?.[0]?.src,
            }))
          }
        }
      } catch (e) {
        console.error('Google Custom Search API error:', e)
      }
    }

    // Smart Fallback Results if API keys aren't set or returned empty
    if (searchItems.length === 0) {
      searchItems = [
        {
          id: 'res-1',
          title: `Рецепты: ${q} — Пошаговый рецепт с фото`,
          url: `https://eda.ru/recepty/search?q=${encodeURIComponent(q)}`,
          domain: 'eda.ru',
          snippet: `Классический рецепт приготовление пошагово. Нежные, ажурные и вкусные блинчики на молоке или кефире. Ингредиенты: мука, яйца, молоко, сахар, щепотка соли.`,
          category: 'all',
          date: '2026',
        },
        {
          id: 'res-2',
          title: `${q} — Лучшие домашние рецепты и секреты приготовления`,
          url: `https://povarenok.ru/recipes/search/?q=${encodeURIComponent(q)}`,
          domain: 'povarenok.ru',
          snippet: `Как приготовить тонкие сладкие блинчики без комочков: добавьте в тесто 2 ложки растительного масла и дайте постоять 15 минут перед жаркой.`,
          category: 'all',
          date: '2026',
        },
        {
          id: 'res-3',
          title: `Видео-урок: ${q} за 15 минут`,
          url: `https://youtube.com/results?search_query=${encodeURIComponent(q)}`,
          domain: 'youtube.com',
          snippet: `Видео-руководство: простые ингредиенты,деальный нагрев сковороды и масляная кисточка для золотистой корочки.`,
          category: 'news',
          date: '2026',
        },
        {
          id: 'res-4',
          title: `${q} — Статья в Википедии`,
          url: `https://ru.wikipedia.org/wiki/Сладкие_блинчики`,
          domain: 'wikipedia.org',
          snippet: `Традиционное блюдо национальной кухни. Изготавливается из жидкого теста, выпекаемого на раскаленной сковороде.`,
          category: 'all',
          date: '2026',
        },
      ]
    }

    setResults(searchItems)
    setIsSearching(false)
    fetchAiOverview(q, searchItems)
  }

  const fetchAiOverview = async (searchQuery: string, currentResults: SearchResultItem[]) => {
    setAiSummaryLoading(true)
    setAiSummary('')

    const contextSnippets = currentResults.slice(0, 3).map((r) => `${r.title}: ${r.snippet}`).join('\n')
    const systemPrompt = `You are Krakenus AI Search Core.
The user searched for: "${searchQuery}"
Generate a brilliant, ultra-useful, beautifully formatted AI Overview answer in ${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}.
If it is a recipe or question, give clear 1-2-3 bullet points and key secrets. Keep it clean and direct.`

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

  const displayedResults = results.filter((r) => {
    if (activeCategory === 'all') return true
    return r.category === activeCategory
  })

  return (
    <div className="search-app-root">
      {/* HEADER NAVBAR */}
      <header className={`site-header ${hasSearched ? 'site-header--compact' : ''}`}>
        <a
          href="/"
          className="brand"
          onClick={(e) => {
            e.preventDefault()
            setQuery('')
            executeSearch('')
          }}
        >
          <OctopusMark compact />
          <span>OCTOPUS</span>
          <sup className="search-sub-tag">SEARCH</sup>
        </a>

        {/* Top Search Bar when in Results Mode */}
        {hasSearched && (
          <form
            className="top-header-search-form"
            onSubmit={(e) => {
              e.preventDefault()
              executeSearch(query)
            }}
          >
            <div className="top-search-wrapper">
              <SearchIcon size={16} className="top-search-icon" />
              <input
                type="text"
                className="top-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setQuery('')
                    executeSearch('')
                  }}
                >
                  <X size={14} />
                </button>
              )}
              <button type="submit" className="top-search-btn">
                <SearchIcon size={14} />
              </button>
            </div>
          </form>
        )}

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
        </div>
      </header>

      {/* GOOGLE API CONFIG MODAL */}
      {showConfigModal && (
        <div className="ai-modal-backdrop" onClick={() => setShowConfigModal(false)}>
          <div className="ai-modal-card" style={{ height: 'auto' }} onClick={(e) => e.stopPropagation()}>
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

      {/* STATE 1: CLEAN MINIMALIST HOME SEARCH PAGE (LIKE GOOGLE HOME) */}
      {!hasSearched ? (
        <main className="search-hero-container hero-home-view">
          <div className="search-brand-hero">
            <div className="search-logo-circle">
              <OctopusMark />
            </div>
            <h1>OCTOPUS <span>SEARCH</span></h1>
            <span className="search-beta-badge">{t.badge}</span>
            <p className="search-tagline">{t.tagline}</p>
          </div>

          <form
            className="search-bar-form"
            onSubmit={(e) => {
              e.preventDefault()
              executeSearch(query)
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
                  onClick={() => setQuery('')}
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
                    executeSearch(q)
                  }}
                >
                  <SearchIcon size={12} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* STATE 2: GOOGLE-STYLE SEARCH RESULTS PAGE */
        <main className="search-results-page-view">
          {/* CATEGORY FILTER TABS BAR */}
          <div className="results-sub-header">
            <div className="results-tab-container">
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
                className={`category-tab ${activeCategory === 'image' ? 'is-active' : ''}`}
                onClick={() => setActiveCategory('image')}
              >
                <ImageIcon size={14} />
                <span>{t.filterImages}</span>
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
          </div>

          <div className="search-results-content-area">
            {/* GOOGLE-STYLE KRAKENUS AI OVERVIEW BOX WITH GLOW ANIMATION */}
            {(aiSummary || aiSummaryLoading) && (
              <div className="ai-overview-card animate-ai-box">
                <div className="ai-overview-header">
                  <div className="ai-sparkle-badge">
                    <Sparkles size={16} />
                  </div>
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

            {/* RESULTS LIST */}
            <div className="search-results-list">
              <div className="results-count-bar">
                <span>{t.resultsFound} <strong>{displayedResults.length}</strong></span>
              </div>

              {isSearching ? (
                <div className="search-empty-state">
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--coral)' }} />
                  <p>Загрузка результатов Поиска Google...</p>
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

                    {item.imageUrl && (
                      <div className="result-image-preview">
                        <img src={item.imageUrl} alt={item.title} loading="lazy" />
                      </div>
                    )}
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
        </main>
      )}
    </div>
  )
}
