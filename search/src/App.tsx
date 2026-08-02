import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ExternalLink,
  Globe,
  Globe2,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  RefreshCw,
  Search as SearchIcon,
  Send,
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
    tabNews: 'Новости',
    tabImages: 'Картинки',
    tabVideos: 'Видео',
    tabMaps: 'Карты',
    aiOverviewTitle: 'Krakenus AI — Обзор с помощью ИИ',
    aiGenerating: 'Поиск источников и сгенерированный ответ ИИ...',
    quickQueries: [
      'как приготовить сладкие блинчики',
      'Что нового в React 19',
      'Документация TanStack Start',
      'Как работает доменная архитектура Octopus',
    ],
    resultsCount: 'Результатов: примерно',
    searchSecNotice: 'Octopus Search — Умная фильтрация информации от шума и рекламы.',
    backToHub: 'octopus.dev',
    footerLocation: 'Украина / Global — Из вашего местоположения',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент Octopus Search',
      welcome: 'Привет! Я **Krakenus AI**. Помогаю с анализом и ответами на любые поисковые запросы.',
      placeholder: 'Задайте вопрос по поиску...',
      quickTitle: 'Подсказки:',
      quickPrompts: [
        'Сделать выжимку',
        'Пошаговый рецепт',
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
    tabNews: 'News',
    tabImages: 'Images',
    tabVideos: 'Videos',
    tabMaps: 'Maps',
    aiOverviewTitle: 'Krakenus AI — AI Overview',
    aiGenerating: 'Searching web sources and generating AI Overview...',
    quickQueries: [
      'how to make sweet pancakes',
      'What is new in React 19',
      'TanStack Start documentation',
      'Octopus domain architecture',
    ],
    resultsCount: 'About',
    searchSecNotice: 'Octopus Search — Smart noise-free search engine.',
    backToHub: 'octopus.dev',
    footerLocation: 'Global — From your location',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'Octopus Search AI Core',
      welcome: 'Hello! I am **Krakenus AI**. I help analyze and answer your search queries.',
      placeholder: 'Ask a question...',
      quickTitle: 'Quick prompts:',
      quickPrompts: [
        'Summarize top results',
        'Step-by-step recipe',
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
    tabNews: 'Новини',
    tabImages: 'Зображення',
    tabVideos: 'Відео',
    tabMaps: 'Карти',
    aiOverviewTitle: 'Krakenus AI — Огляд за допомогою ШІ',
    aiGenerating: 'Пошук джерел та генерація миттєвої відповіді ШІ...',
    quickQueries: [
      'як приготувати солодкі млинці',
      'Що нового в React 19',
      'Документація TanStack Start',
      'Як працює доменна архітектура Octopus',
    ],
    resultsCount: 'Результатів: приблизно',
    searchSecNotice: 'Octopus Search — Розумне фільтрування інформації від спаму.',
    backToHub: 'octopus.dev',
    footerLocation: 'Україна / Global — З вашого розташування',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ШІ-асистент Octopus Search',
      welcome: 'Вітаю! Я **Krakenus AI**. Допомагаю з аналізом та відповідями на будь-які запити.',
      placeholder: 'Задайте питання...',
      quickTitle: 'Підказки:',
      quickPrompts: [
        'Зробити короткий висновок',
        'Покроковий рецепт',
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

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^([-*]|\d+\.)\s*/, '')
          return (
            <div key={lineIdx} className="formatted-list-item">
              <span className="list-bullet">•</span>
              <span>{parseInlineMarkdown(content)}</span>
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
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'images' | 'videos'>('all')

  // Search Results & AI Overview
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [searchTime, setSearchTime] = useState('0.28')

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

  // URL Query Sync (e.g., ?q=сладкие+блинчики)
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

  // Execute AI-Driven Search Response + Formatted Sources
  const executeAiSearch = async (searchQueryText: string) => {
    const q = searchQueryText.trim()
    if (!q) {
      setHasSearched(false)
      setActiveQuery('')
      setResults([])
      setAiSummary('')
      window.history.pushState(null, '', window.location.pathname)
      return
    }

    const startTime = performance.now()
    setHasSearched(true)
    setActiveQuery(q)
    setIsSearching(true)
    setAiSummary('')

    // Update URL query string e.g. ?q=...
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(q)}`
    window.history.pushState(null, '', newUrl)

    const langName = lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'
    const systemPrompt = `You are Krakenus AI, the search engine intelligence core for Octopus Search.
The user's query is: "${q}".

Instructions:
1. Provide a comprehensive, clear, expert AI Answer / Overview for this search query in ${langName}. Use bullet points, bold key terms, and 1-2-3 steps where helpful.
2. At the end of your answer, output EXACTLY the line "---SOURCES---" followed by a JSON array of 4 relevant web sources.

Example format:
[Direct AI Answer Text Here]

---SOURCES---
[
  {
    "title": "Заголовок страницы или рецепта",
    "url": "https://example.com/page",
    "domain": "example.com",
    "snippet": "Краткое описание страницы или рецепта..."
  }
]`

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
            // Match JSON block inside markdown if wrapped in ```json
            const jsonMatch = sourcesRaw.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
              const parsed: any[] = JSON.parse(jsonMatch[0])
              const formattedItems: SearchResultItem[] = parsed.map((item, idx) => ({
                id: `ai-src-${idx}`,
                title: item.title || item.domain || `Результат ${idx + 1}`,
                url: item.url || `https://${item.domain || 'google.com'}`,
                domain: item.domain || 'web.search',
                snippet: item.snippet || 'Подробная информация по вашему запросу.',
              }))
              setResults(formattedItems)
            } else {
              setResults(getFallbackResults(q))
            }
          } catch (jsonErr) {
            setResults(getFallbackResults(q))
          }
        } else {
          setAiSummary(fullContent)
          setResults(getFallbackResults(q))
        }
      } else {
        setAiSummary(`Не удалось загрузить данные ИИ. Попробуйте еще раз.`)
        setResults(getFallbackResults(q))
      }
    } catch (e) {
      console.error('Search error:', e)
      setAiSummary(`Ошибка сети. Проверьте подключение.`)
      setResults(getFallbackResults(q))
    } finally {
      setIsSearching(false)
    }
  }

  const getFallbackResults = (q: string): SearchResultItem[] => {
    return [
      {
        id: 'fallback-1',
        title: `${q} — Подробный материал и руководство`,
        url: `https://google.com/search?q=${encodeURIComponent(q)}`,
        domain: 'google.com',
        snippet: `Полная информация, пошаговые инструкции и проверенные советы по запросу "${q}".`,
      },
      {
        id: 'fallback-2',
        title: `Рецепты и статьи: ${q}`,
        url: `https://eda.ru/recepty/search?q=${encodeURIComponent(q)}`,
        domain: 'eda.ru',
        snippet: `Лучшие проверенные рецепты и кулинарные хитрости приготовления со свежими фото.`,
      },
      {
        id: 'fallback-3',
        title: `Википедия — ${q}`,
        url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(q)}`,
        domain: 'wikipedia.org',
        snippet: `Материал из свободной энциклопедии: истории, классификации и подробные факты.`,
      },
      {
        id: 'fallback-4',
        title: `Видео по запросу: ${q}`,
        url: `https://youtube.com/results?search_query=${encodeURIComponent(q)}`,
        domain: 'youtube.com',
        snippet: `Смотрите обучающие ролики, рецепты и обзоры в высоком качестве.`,
      },
    ]
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
          {/* Top Bar Navigation */}
          <header className="google-home-header">
            <a href="https://octopus.dev" className="google-hub-link">
              <span>{t.backToHub}</span>
            </a>

            <div className="google-header-actions">
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

          {/* Centered Google Hero Section */}
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

          {/* Google Footer Bar */}
          <footer className="google-home-footer">
            <div className="google-footer-row google-footer-location">
              <MapPin size={13} />
              <span>{t.footerLocation}</span>
            </div>
          </footer>
        </div>
      ) : (
        /* STATE 2: GOOGLE SEARCH RESULTS UI DESIGN */
        <div className="google-results-layout">
          {/* Top Google Results Header */}
          <header className="google-results-header">
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

            <div className="google-top-actions">
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

          {/* Google Sub-Navigation Bar (Tabs: Все, Новости, Картинки, Видео) */}
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
                className={`google-tab ${activeTab === 'news' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('news')}
              >
                <Newspaper size={14} />
                <span>{t.tabNews}</span>
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
                className={`google-tab ${activeTab === 'videos' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                <Video size={14} />
                <span>{t.tabVideos}</span>
              </button>
            </div>
          </div>

          {/* Google Organic Search Results Area */}
          <main className="google-results-main">
            <div className="google-stats-line">
              <span>{t.resultsCount} {results.length * 1420} ({searchTime} сек.)</span>
            </div>

            {/* GOOGLE AI OVERVIEW BOX */}
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
                    <p>{t.aiGenerating}</p>
                  </div>
                ) : (
                  <div className="google-ai-body">
                    <FormattedAiText text={aiSummary} />
                  </div>
                )}
              </div>
            )}

            {/* ORGANIC GOOGLE SEARCH RESULTS LIST */}
            <div className="google-organic-list">
              {results.length > 0 ? (
                results.map((item) => (
                  <article key={item.id} className="google-result-item">
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
                  </article>
                ))
              ) : !isSearching ? (
                <div className="google-no-results">
                  <p>По вашему запросу ничего не найдено.</p>
                </div>
              ) : null}
            </div>

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
