import { IndexEntry, SEARCH_INDEX } from '../data/searchIndex'

const STOP_WORDS = new Set([
  'как', 'где', 'что', 'чем', 'для', 'или', 'без', 'под', 'над', 'при', 'все', 'это',
  'how', 'to', 'what', 'where', 'for', 'the', 'and', 'or', 'in', 'on', 'at', 'a', 'an',
  'як', 'де', 'що', 'для', 'або', 'під', 'над', 'при', 'все',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\d\u0400-\u04FF\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
}

export function detectIntentCategory(query: string): 'cooking' | 'gaming' | 'tech' | 'education' | 'general' {
  const tokens = tokenize(query)

  const cookingKeywords = ['блинчики', 'блины', 'рецепт', 'приготовить', 'молоке', 'клубникой', 'выпечка', 'еда', 'кулинария', 'крепы', 'pancake', 'pancakes', 'recipe', 'cook']
  const gamingKeywords = ['roblox', 'роблокс', 'скачать', 'пк', 'pc', 'игра', 'игры', 'minecraft', 'майнкрафт', 'установить', 'гейминг', 'game', 'play', 'studio']
  const techKeywords = ['react', '19', 'tanstack', 'start', 'vite', 'javascript', 'typescript', 'код', 'программирование', 'дев', 'dev', 'habr', 'github']

  for (const token of tokens) {
    if (cookingKeywords.some((k) => token.includes(k) || k.includes(token))) return 'cooking'
    if (gamingKeywords.some((k) => token.includes(k) || k.includes(token))) return 'gaming'
    if (techKeywords.some((k) => token.includes(k) || k.includes(token))) return 'tech'
  }

  return 'general'
}

export function searchOctopusEngine(rawQuery: string): IndexEntry[] {
  const cleanQ = rawQuery.trim()
  if (!cleanQ) return []

  const queryTokens = tokenize(cleanQ)
  const categoryIntent = detectIntentCategory(cleanQ)

  // 1. Score pre-indexed pages
  const scoredEntries = SEARCH_INDEX.map((entry) => {
    let score = 0

    // Category Match Boost
    if (entry.category === categoryIntent) {
      score += 40
    }

    const titleLower = entry.title.toLowerCase()
    const snippetLower = entry.snippet.toLowerCase()
    const domainLower = entry.domain.toLowerCase()

    queryTokens.forEach((token) => {
      // Title match
      if (titleLower.includes(token)) score += 50
      // Domain match
      if (domainLower.includes(token)) score += 45
      // Keyword array match
      if (entry.keywords.some((kw) => kw.includes(token) || token.includes(kw))) score += 30
      // Snippet match
      if (snippetLower.includes(token)) score += 15
    })

    return { entry, score }
  })

  // Filter items with score > 0 and sort by score descending
  const matched = scoredEntries
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry)

  // 2. Synthesize EXACTLY 10 category-matching items
  const finalResults: IndexEntry[] = [...matched]

  const categoryDomains = {
    cooking: ['eda.ru', 'povarenok.ru', 'gastronom.ru', 'allrecipes.com', 'lifehacker.ru', 'say7.info', 'allrecipes.ru', 'food.ru', 'tasty.co', 'kitchen.ru'],
    gaming: ['roblox.com', 'help.roblox.com', 'play.google.com', 'apps.apple.com', 'create.roblox.com', 'microsoft.com', 'roblox.fandom.com', 'techblog.ru', 'steam.com', 'ign.com'],
    tech: ['react.dev', 'tanstack.com', 'habr.com', 'github.com', 'medium.com', 'tproger.ru', 'developer.mozilla.org', 'stackoverflow.com', 'dev.to', 'npm.js'],
    education: ['wikipedia.org', 'stepik.org', 'coursera.org', 'postnauka.ru', 'britannica.com', 'habr.com', 'medium.com', 'ted.com', 'cyberleninka.ru', 'nplus1.ru'],
    general: ['google.com', 'wikipedia.org', 'medium.com', 'habr.com', 'reddit.com', 'youtube.com', 'github.com', 'microsoft.com', 'apple.com', 'news.com'],
  }

  const domains = categoryDomains[categoryIntent] || categoryDomains.general
  const topicCategory = categoryIntent

  let idx = 0
  while (finalResults.length < 10) {
    const domain = domains[idx % domains.length]

    let title = ''
    let snippet = ''
    let imageUrl = ''

    if (topicCategory === 'cooking') {
      title = `${cleanQ} — Рецепт, ингредиенты и пошаговые фото`
      snippet = `Кулинарное руководство по приготовлению: пропорции продуктов, секреты идеального теста и подача к столу.`
      imageUrl = [
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
      ][idx % 4]
    } else if (topicCategory === 'gaming') {
      title = `${cleanQ} — Скачать и играть онлайн`
      snippet = `Официальный клиент, системные требования, пошаговая установка и доступ к сервисам.`
      imageUrl = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Roblox_Logo_2022.svg/800px-Roblox_Logo_2022.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_2022.svg/800px-Roblox_player_icon_2022.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roblox_Studio_2021_Icon.svg/800px-Roblox_Studio_2021_Icon.svg.png',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop&q=80',
      ][idx % 4]
    } else {
      title = `${cleanQ} — Подробный обзор и руководство`
      snippet = `Актуальная информация, документация, примеры применения и решение частых вопросов по запросу "${cleanQ}".`
      imageUrl = [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      ][idx % 4]
    }

    finalResults.push({
      id: `engine-dyn-${idx}`,
      title,
      url: `https://${domain}/search?q=${encodeURIComponent(cleanQ)}`,
      domain,
      snippet,
      category: topicCategory,
      keywords: queryTokens,
      imageUrl,
    })
    idx++
  }

  return finalResults.slice(0, 10)
}
