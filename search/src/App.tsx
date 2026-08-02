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
    aiGenerating: 'Поиск тематических изображений и 10 джерел...',
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
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ИИ-ассистент Octopus Search',
      welcome: 'Привет! Я **Krakenus AI**. Помогаю с анализом и поиском до 10 релевантных сайтов и картинок по вашей теме.',
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
    aiGenerating: 'Generating concise AI summary & 10 top results with topic images...',
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
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'Octopus Search AI Core',
      welcome: 'Hello! I am **Krakenus AI**. I help summarize and find top 10 sites with matching topic images.',
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
    aiGenerating: 'Генерація відповіді ШІ, картинок та 10 сайтів...',
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
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'ШІ-асистент Octopus Search',
      welcome: 'Вітаю! Я **Krakenus AI**. Допомагаю з аналізом та добіркою до 10 сайтів та тематичних картинок.',
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

// Fetch real topic-matching images using Wikimedia Commons API & LoremFlickr keyword search
async function fetchRealTopicImages(searchQuery: string): Promise<string[]> {
  const images: string[] = []
  const cleanKeyword = searchQuery
    .toLowerCase()
    .replace(/скачать|на пк|бесплатно|как|приготовить|игры|игра/g, '')
    .trim() || searchQuery

  // 1. Try Wikimedia Commons API for exact query topic photos
  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanKeyword)}&gsrlimit=12&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`
    const res = await fetch(wikiUrl)
    if (res.ok) {
      const data = await res.json()
      const pages = data?.query?.pages
      if (pages) {
        for (const key in pages) {
          const thumb = pages[key]?.thumbnail?.source
          if (thumb && !thumb.endsWith('.svg')) {
            images.push(thumb)
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Keyword-based topic fallback images
  for (let i = 1; i <= 10; i++) {
    images.push(`https://loremflickr.com/600/400/${encodeURIComponent(cleanKeyword)}?lock=${i * 7}`)
  }

  return images
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
  const generateDynamicFallbackItem = (q: string, idx: number, topicImages: string[]): SearchResultItem => {
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
      imageUrl: topicImages[idx % topicImages.length],
    }
  }

  // Execute AI Search with UP TO 5 RETRIES & 5s COUNTDOWN
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

    // Pre-fetch topic matching images for query `q`
    const topicImages = await fetchRealTopicImages(q)

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
              if (jsonMatch) {
                const parsed: any[] = JSON.parse(jsonMatch[0])
                const formattedItems: SearchResultItem[] = parsed.map((item, idx) => ({
                  id: `ai-src-${idx}`,
                  title: item.title || item.domain || `Результат ${idx + 1}`,
                  url: item.url || `https://${item.domain || 'google.com'}`,
                  domain: item.domain || 'web.search',
                  snippet: item.snippet || 'Подробная информация по вашему запросу.',
                  imageUrl: topicImages[idx % topicImages.length],
                }))

                // FORCE EXACTLY 10 ITEMS
                while (formattedItems.length < 10) {
                  formattedItems.push(generateDynamicFallbackItem(q, formattedItems.length, topicImages))
                }

                setResults(formattedItems.slice(0, 10))
                success = true
                break
              }
            } catch (jsonErr) {
              setResults(Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i, topicImages)))
              success = true
              break
            }
          } else {
            setAiSummary(fullContent)
            setResults(Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i, topicImages)))
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
      setResults(Array.from({ length: 10 }, (_, i) => generateDynamicFallbackItem(q, i, topicImages)))
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

                {/* EXACTLY 10 ORGANIC SITES LIST WITH REAL QUERY MATCHED IMAGES */}
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
                                  const cleanKeyword = activeQuery.toLowerCase().replace(/скачать|на пк|бесплатно|как/g, '').trim() || activeQuery
                                  target.src = `https://loremflickr.com/600/400/${encodeURIComponent(cleanKeyword)}?lock=${(index + 1) * 7}`
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
                        src={item.imageUrl || `https://loremflickr.com/600/400/${encodeURIComponent(activeQuery)}?lock=${(index + 1) * 7}`}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.onerror = null
                          const cleanKeyword = activeQuery.toLowerCase().replace(/скачать|на пк|бесплатно|как/g, '').trim() || activeQuery
                          target.src = `https://loremflickr.com/600/400/${encodeURIComponent(cleanKeyword)}?lock=${(index + 1) * 7}`
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
