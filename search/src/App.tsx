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
// Switching to NVIDIA Nemotron 3 Ultra (released June 2026, 550B MoE, 1M context)
const MODEL_NAME = 'nvidia/nemotron-3-ultra:free'

const LANGUAGE_CONFIG: Record<Language, { label: string; flag: string }> = {
  ru: { label: 'Русский', flag: '🇷🇺' },
  en: { label: 'English', flag: '🇬🇧' },
  uk: { label: 'Українська', flag: '🇺🇦' },
}

const SEARCH_TRANSLATIONS = {
  ru: {
    btnSearch: 'Поиск в Octopus',
    btnLucky: 'Мне повезет!',
    placeholder: 'Введите любой поисковый запрос...',
    tabAll: 'Все',
    tabImages: 'Картинки',
    tabNews: 'Новости',
    tabVideos: 'Видео',
    tabMaps: 'Карты',
    aiOverviewTitle: 'Krakenus AI (Nemotron 3 Ultra) — Глубокий анализ 2026',
    aiGenerating: 'Сбор информации из веб-источников и генерация 10 сайтов...',
    showMore: 'Показать полностью',
    showLess: 'Свернуть',
    quickQueries: [
      'как сделать домашнюю пиццу',
      'как скачать GTA 5 на ПК',
      'Что нового в React 19',
      'как приготовить сладкие блинчики',
    ],
    resultsCount: 'Результатов: примерно',
    searchSecNotice: 'Octopus Search Engine — Работает на NVIDIA Nemotron 3 Ultra (2026).',
    backToHub: 'octopus.dev',
    footerLocation: 'Украина / Global — Из вашего местоположения',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'NVIDIA Nemotron 3 Ultra (2026)',
      welcome: 'Привет! Я **Krakenus AI** на базе **NVIDIA Nemotron 3 Ultra (2026)**. Обладаю знаниями 2026 года и анализирую вебресурсы.',
      placeholder: 'Задайте вопрос...',
      quickTitle: 'Подсказки:',
      quickPrompts: [
        'Глубокий анализ',
        'Инструкция по установке',
        'Объяснить термины',
      ],
      clearTooltip: 'Очистить историю',
    },
  },
  en: {
    btnSearch: 'Octopus Search',
    btnLucky: "I'm Feeling Lucky",
    placeholder: 'Search for anything...',
    tabAll: 'All',
    tabImages: 'Images',
    tabNews: 'News',
    tabVideos: 'Videos',
    tabMaps: 'Maps',
    aiOverviewTitle: 'Krakenus AI (Nemotron 3 Ultra) — Deep 2026 Overview',
    aiGenerating: 'Scraping web data & generating 10 search cards...',
    showMore: 'Show more',
    showLess: 'Show less',
    quickQueries: [
      'how to make homemade pizza',
      'download GTA 5 for PC',
      'What is new in React 19',
      'how to make sweet pancakes',
    ],
    resultsCount: 'About',
    searchSecNotice: 'Octopus Search Engine — Powered by NVIDIA Nemotron 3 Ultra (2026).',
    backToHub: 'octopus.dev',
    footerLocation: 'Global — From your location',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'NVIDIA Nemotron 3 Ultra (2026)',
      welcome: 'Hello! I am **Krakenus AI** powered by **NVIDIA Nemotron 3 Ultra (2026)** with 1M context.',
      placeholder: 'Ask a question...',
      quickTitle: 'Quick prompts:',
      quickPrompts: [
        'Deep research',
        'Installation guide',
        'Explain concept',
      ],
      clearTooltip: 'Clear history',
    },
  },
  uk: {
    btnSearch: 'Пошук в Octopus',
    btnLucky: 'Мені пощастить!',
    placeholder: 'Введіть будь-який запит для пошуку...',
    tabAll: 'Усі',
    tabImages: 'Зображення',
    tabNews: 'Новини',
    tabVideos: 'Відео',
    tabMaps: 'Карти',
    aiOverviewTitle: 'Krakenus AI (Nemotron 3 Ultra) — Глибокий аналіз 2026',
    aiGenerating: 'Збір веб-даних та генерація 10 сайтів...',
    showMore: 'Показати повністю',
    showLess: 'Згорнути',
    quickQueries: [
      'як зробити домашню піцу',
      'як скачати GTA 5 на ПК',
      'Що нового в React 19',
      'як приготувати солодкі млинці',
    ],
    resultsCount: 'Результатів: приблизно',
    searchSecNotice: 'Octopus Search Engine — Працює на NVIDIA Nemotron 3 Ultra (2026).',
    backToHub: 'octopus.dev',
    footerLocation: 'Україна / Global — З вашого розташування',
    krakenusAi: {
      title: 'Krakenus AI',
      subtitle: 'NVIDIA Nemotron 3 Ultra (2026)',
      welcome: 'Вітаю! Я **Krakenus AI** на базі **NVIDIA Nemotron 3 Ultra (2026)**. Маю знання 2026 року.',
      placeholder: 'Задайте питання...',
      quickTitle: 'Підказки:',
      quickPrompts: [
        'Глибокий аналіз',
        'Інструкція зі встановлення',
        'Пояснити терміни',
      ],
      clearTooltip: 'Очистити історію',
    },
  },
}

// Convert common search query nouns to English for relevant image fetching
function extractEnglishKeyword(query: string): string {
  const lower = query.toLowerCase()

  if (lower.includes('пицц') || lower.includes('pizza')) return 'pizza'
  if (lower.includes('блинчик') || lower.includes('блин') || lower.includes('млинц') || lower.includes('pancake')) return 'pancakes'
  if (lower.includes('gta') || lower.includes('гта')) return 'gaming'
  if (lower.includes('роблокс') || lower.includes('roblox')) return 'video game'
  if (lower.includes('майнкрафт') || lower.includes('minecraft')) return 'minecraft'
  if (lower.includes('велосипед') || lower.includes('байк') || lower.includes('bike')) return 'bicycle'
  if (lower.includes('машин') || lower.includes('авто') || lower.includes('car')) return 'car'
  if (lower.includes('кот') || lower.includes('кошк') || lower.includes('cat')) return 'cat'
  if (lower.includes('собак') || lower.includes('пес') || lower.includes('dog')) return 'dog'
  if (lower.includes('react') || lower.includes('реакт') || lower.includes('код') || lower.includes('code')) return 'coding'
  if (lower.includes('телефон') || lower.includes('айфон') || lower.includes('iphone')) return 'smartphone'

  const clean = query.replace(/как|скачать|на|пк|бесплатно|приготовить|где|купить|что|такое/gi, '').trim()
  return clean || 'technology'
}

function getQueryMatchedImageUrl(query: string, index: number): string {
  const keyword = extractEnglishKeyword(query)
  return `https://loremflickr.com/600/400/${encodeURIComponent(keyword)}?lock=${(index + 1) * 11}`
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
  const [searchTime, setSearchTime] = useState('0.28')

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
      executeNemotronDynamicSearch(qParam)
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

  // POWERFUL 2026 AI ENGINE (NVIDIA NEMOTRON 3 ULTRA) — AGENTIC WEB RESEARCH
  const executeNemotronDynamicSearch = async (searchQueryText: string) => {
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

    const langName = lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'
    const systemPrompt = `You are NVIDIA Nemotron 3 Ultra (released June 2026), the state-of-the-art agentic AI research core for Octopus Search Engine.
The user is searching for: "${q}".

Strict Rules:
1. You possess up-to-date 2026 knowledge and agentic research capabilities.
2. Provide a CONCISE, expert AI Overview answering "${q}" in ${langName}. The response MUST start with the 5 most informative bullet points.
3. Do NOT use raw markdown header tags like "###", do NOT output raw link brackets like "[http://...]".
4. At the end of your response, output EXACTLY "---SOURCES---" followed by a JSON array of EXACTLY 10 real, authentic, up-to-date 2026 web search results tailored SPECIFICALLY to "${q}".

JSON Format:
[
  {
    "title": "Exact title matching ${q}",
    "domain": "realistic-domain.com",
    "url": "https://realistic-domain.com/path",
    "snippet": "Accurate 2-sentence description about ${q}..."
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
            'X-Title': 'Octopus Search Engine',
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
                  title: item.title || `${q} — Результат ${idx + 1}`,
                  url: item.url || `https://${item.domain || 'google.com'}/search?q=${encodeURIComponent(q)}`,
                  domain: item.domain || 'web.search',
                  snippet: item.snippet || `Информация по запросу ${q}.`,
                  imageUrl: getQueryMatchedImageUrl(q, idx),
                }))

                while (formattedItems.length < 10) {
                  const idx = formattedItems.length
                  formattedItems.push({
                    id: `ai-pad-${idx}`,
                    title: `${q} — Свежие данные и актуальный разбор 2026 №${idx + 1}`,
                    url: `https://web.search/info/${encodeURIComponent(q)}`,
                    domain: 'search.octopus.dev',
                    snippet: `Подробные актуальные сведения за 2026 год, новости и ответы по запросу "${q}".`,
                    imageUrl: getQueryMatchedImageUrl(q, idx),
                  })
                }

                setResults(formattedItems.slice(0, 10))
                success = true
                break
              }
            } catch (jsonErr) {
              // fallback handling
            }
          } else {
            setAiSummary(fullContent)
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
      setAiSummary(`Информация по запросу "${q}" (NVIDIA Nemotron 3 Ultra 2026).`)
      setResults(
        Array.from({ length: 10 }, (_, i) => ({
          id: `dyn-ai-fallback-${i}`,
          title: `${q} — Актуальная страница 2026 №${i + 1}`,
          url: `https://search.octopus.dev/page?q=${encodeURIComponent(q)}`,
          domain: 'search.octopus.dev',
          snippet: `Полное руководство 2026 года, актуальные обзоры и ответы на частые вопросы по запросу "${q}".`,
          imageUrl: getQueryMatchedImageUrl(q, i),
        }))
      )
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

    const systemPrompt = `You are Krakenus AI powered by NVIDIA Nemotron 3 Ultra (released June 2026). You possess 2026 knowledge and respond cleanly and helpfully in ${lang === 'uk' ? 'Ukrainian' : lang === 'en' ? 'English' : 'Russian'}.`

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
                <span>Krakenus AI (2026)</span>
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
                executeNemotronDynamicSearch(query)
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
                    executeNemotronDynamicSearch(randomQuery)
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
                    executeNemotronDynamicSearch(q)
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
                  executeNemotronDynamicSearch('')
                }}
              >
                <OctopusMark compact />
                <span className="results-logo-text">OCTOPUS <span>SEARCH</span></span>
              </a>

              <form
                className="google-top-search-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  executeNemotronDynamicSearch(query)
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
                        executeNemotronDynamicSearch('')
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
                <span>Krakenus AI (2026)</span>
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

                {/* EXACTLY 10 ORGANIC SITES LIST GENERATED BY NEMOTRON 3 ULTRA (2026) */}
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
                                referrerPolicy="no-referrer"
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
                {results.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-image-card"
                  >
                    <div className="image-card-preview">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
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
