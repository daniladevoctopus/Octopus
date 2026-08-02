import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowRight,
  Asterisk,
  Boxes,
  Braces,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Compass,
  Download,
  ExternalLink,
  Globe2,
  Menu,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    id: 'search',
    code: '01',
    name: 'Octopus Search',
    domain: 'search.octopus.dev',
    description:
      'Быстрый поиск по нужным источникам без лишнего шума и перегруженной выдачи.',
    icon: Search,
    accent: 'coral',
    status: 'В разработке',
    badge: 'Умный фильтр',
  },
  {
    id: 'studio',
    code: '02',
    name: 'Octopus Studio',
    domain: 'studio.octopus.dev',
    description:
      'Небольшие веб‑продукты, экспериментальные интерфейсы и инструменты для создателей.',
    icon: Braces,
    accent: 'lime',
    status: 'Скоро',
    badge: 'Креатив',
  },
  {
    id: 'cloud',
    code: '03',
    name: 'Octopus Cloud',
    domain: 'cloud.octopus.dev',
    description:
      'Единое пространство для данных и связей между будущими сервисами экосистемы.',
    icon: Cloud,
    accent: 'blue',
    status: 'Концепт',
    badge: 'Синхронизация',
  },
]

const principles = [
  ['Один аккаунт', 'Сервисы работают как единая система, а не набор случайных страниц.'],
  ['Честный интерфейс', 'Понятные функции, спокойный дизайн и никакой визуальной суеты.'],
  ['Малые релизы', 'Каждый продукт решает одну задачу хорошо и постепенно становится сильнее.'],
]

const tourStepsData = [
  {
    targetId: 'top',
    title: 'Привет! Я Octopus 🚀',
    text: 'Я твой гид на джетпаке! Листай страницу сам или нажимай кнопку — я расскажу обо всех 6 секциях.',
    buttonText: 'В путь ➔',
  },
  {
    targetId: 'manifesto',
    title: '1. Манифест',
    text: 'Octopus — не сухая корпорация, а уютная цифровая мастерская для полезных и красивых веб-вещей.',
    buttonText: 'К сервисам ➔',
  },
  {
    targetId: 'services',
    title: '2. Сервисы',
    text: 'Наша экосистема: Search для умного поиска, Studio для инструментов и Cloud для единой связи.',
    buttonText: 'К принципам ➔',
  },
  {
    targetId: 'principles',
    title: '3. Наш подход',
    text: 'Сложное остаётся внутри. Один аккаунт, малые релизы и спокойный честный интерфейс.',
    buttonText: 'К доменам ➔',
  },
  {
    targetId: 'domains',
    title: '4. Архитектура',
    text: 'Главный сайт octopus.netlify.app выступает картой, а каждый продукт получает свой поддомен.',
    buttonText: 'К финалу ➔',
  },
  {
    targetId: 'closing',
    title: '5. Финал ✦',
    text: 'Экскурсия завершена! Весь сайт разблокирован. Заходи в любое время и скачивай логотип!',
    buttonText: 'В гнездо 🏠',
  },
]

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Tour state & Locking mechanism
  const [tourUnlocked, setTourUnlocked] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Flight Animations (Takeoff & Landing Back)
  const [isTakingOff, setIsTakingOff] = useState(false)
  const [isLandingBack, setIsLandingBack] = useState(false)

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
        const sectionIds = tourStepsData.map((s) => s.targetId)
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
  }, [tourActive, isLandingBack])

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
    if (nextIndex < tourStepsData.length) {
      setCurrentStepIndex(nextIndex)
      scrollToTarget(tourStepsData[nextIndex].targetId)
    } else {
      finishTour()
    }
  }

  const finishTour = () => {
    setIsLandingBack(true)
    setTourUnlocked(true)
    
    // Smoothly scroll back to top as mascot flies back to nest!
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

  const currentStep = tourStepsData[currentStepIndex]

  return (
    <main className={!tourUnlocked && !tourActive ? 'site-locked' : ''}>
      {/* Top Scroll Progress Indicator */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* FLYING JETPACK OCTOPUS ASSISTANT (With takeoff & landing back flight maneuvers) */}
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
                  title="Вернуться в гнездо"
                >
                  <X size={13} />
                </button>
              </div>
              <p>{currentStep.text}</p>
              <div className="tour-assistant-footer">
                <span className="tour-step-counter">
                  {currentStepIndex + 1} / {tourStepsData.length}
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
            <a href="#services">Сервисы</a>
            <a href="#principles">Подход</a>
            <a href="#domains">Домены</a>
          </nav>
        )}

        <div className="header-actions-right">
          <a className="header-status" href="#services">
            <span />
            Развиваемся
            <ArrowDownRight size={15} />
          </a>
        </div>

        {tourUnlocked && (
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        )}

        {menuOpen && tourUnlocked && (
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            {[
              ['Сервисы', '#services'],
              ['Подход', '#principles'],
              ['Домены', '#domains'],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ChevronRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* --- COMPACT HERO SECTION --- */}
      <section className="hero hero--compact" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow reveal reveal-1">
            <Asterisk size={15} />
            Независимая цифровая лаборатория
          </div>
          <h1 className="reveal reveal-2">
            Много идей.
            <br />
            <span>Одна умная</span> система.
          </h1>
          <p className="hero-lead reveal reveal-3">
            Octopus — дом для моих будущих проектов, сервисов и экспериментов.
            Каждый продукт живёт отдельно, но остаётся частью одной экосистемы.
          </p>
          <div className="hero-actions reveal reveal-4">
            {!tourUnlocked ? (
              <button type="button" className="button button--primary button--jetpack" onClick={startTour}>
                <Rocket size={18} />
                Запустить гида на джетпаке
              </button>
            ) : (
              <a className="button button--primary" href="#services">
                Смотреть экосистему
                <ArrowRight size={18} />
              </a>
            )}

            {!tourUnlocked && (
              <button type="button" className="text-link" onClick={finishTour}>
                Пропустить и разблокировать
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
            title={tourActive ? 'Осьминог улетел в гид!' : 'Кликни, чтобы запустить осьминога на джетпаке!'}
          >
            {!tourActive && !isLandingBack ? (
              <>
                <div className="mascot-avatar">
                  <OctopusMark animated />
                </div>
                <div className="mascot-badge">
                  <Sparkles size={13} />
                  <span>Помощник Octopus</span>
                </div>
                <small>Кликни, чтобы запустить 🚀</small>
              </>
            ) : (
              <div className="mascot-nest-empty">
                <span className="nest-ring" />
                <p>{isLandingBack ? 'Возврат в гнездо 🏠' : 'В полёте 🚀'}</p>
              </div>
            )}
          </button>
        </div>

        <div className="hero-index" aria-hidden="true">01 — 08</div>
        {tourUnlocked && (
          <a className="scroll-cue" href="#services" aria-label="Прокрутить к сервисам">
            <span>Листать</span>
            <ArrowDownRight size={18} />
          </a>
        )}
      </section>

      {/* REST OF SITE */}
      <div className={`site-sections-wrap ${!tourUnlocked && !tourActive ? 'is-locked-sections' : ''}`}>
        <section className="manifesto reveal-on-scroll" id="manifesto">
          <div className="section-kicker">/ Зачем это существует</div>
          <div className="manifesto-main">
            <p>
              Не очередная «корпорация».
              <span> Небольшая мастерская полезных цифровых вещей.</span>
            </p>
          </div>
          <div className="manifesto-side">
            <Compass size={28} className="spin-on-hover" />
            <p>
              Octopus объединяет самостоятельные продукты под одним именем,
              общими принципами и узнаваемым характером.
            </p>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading reveal-on-scroll">
            <div>
              <div className="section-kicker section-kicker--light">/ Экосистема</div>
              <h2>Будущие<br />сервисы</h2>
            </div>
            <p>
              От поиска до инструментов для работы — каждое новое направление
              получает свой адрес и собственный ритм.
            </p>
          </div>

          <div className="services-list">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <article
                  className={`service-row service-row--${service.accent} reveal-on-scroll`}
                  key={service.code}
                  style={{ animationDelay: `${index * 0.15}s` }}
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
            <div className="section-kicker">/ Принципы</div>
            <h2>Сложное<br /><em>остаётся</em> внутри.</h2>
            <div className="principles-seal">
              <ShieldCheck size={20} />
              <span>Сделано<br />с вниманием</span>
            </div>
          </div>
          <div className="principle-list">
            {principles.map(([title, description], index) => (
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
            <div className="section-kicker section-kicker--light">/ Архитектура адресов</div>
            <h2>Один бренд.<br />Много входов.</h2>
            <p>
              Главная страница работает как карта экосистемы. Сервисы получают
              собственные поддомены после подключения личного домена.
            </p>
            <div className="domain-note">
              <Sparkles size={18} className="pulse-sparkle" />
              <span>
                На стандартном адресе Netlify сервисы можно запускать отдельными
                сайтами, а затем объединить их своим доменом.
              </span>
            </div>
          </div>

          <div className="domain-map reveal-on-scroll" aria-label="Пример структуры доменов">
            <div className="domain-root">
              <div className="domain-root__icon"><Boxes /></div>
              <div>
                <small>Главный сайт</small>
                <strong>octopus.netlify.app</strong>
              </div>
              <span>MAIN</span>
            </div>
            <div className="domain-branch" />
            <div className="domain-child domain-child--one">
              <Search size={18} />
              <div><small>Сервис 01</small><strong>search.octopus.dev</strong></div>
            </div>
            <div className="domain-child domain-child--two">
              <Braces size={18} />
              <div><small>Сервис 02</small><strong>studio.octopus.dev</strong></div>
            </div>
            <div className="domain-child domain-child--three">
              <Cloud size={18} />
              <div><small>Сервис 03</small><strong>cloud.octopus.dev</strong></div>
            </div>
          </div>
        </section>

        <section className="closing-section reveal-on-scroll" id="closing">
          <div className="closing-shape" aria-hidden="true">
            <OctopusMark animated />
          </div>
          <div className="section-kicker">/ Начало истории</div>
          <h2>Сейчас здесь<br />тихо. <em>Но ненадолго.</em></h2>
          <p>
            Новые проекты появятся на этой странице по мере готовности — без
            громких обещаний, зато с работающими ссылками.
          </p>
          <a className="button button--dark" href="#top">
            Вернуться к началу
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
              <span>PNG без фона</span>
            </button>
          </div>
          <p className="reveal-on-scroll">Независимые продукты из одного цифрового дома.</p>
          <div className="footer-meta reveal-on-scroll">
            <span>© {new Date().getFullYear()}</span>
            <a href="#services">Проекты <ExternalLink size={13} /></a>
          </div>
        </footer>
      </div>
    </main>
  )
}
