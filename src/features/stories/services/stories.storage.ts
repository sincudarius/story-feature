import type { Story } from '../types/story.types'

const STORAGE_KEY = 'stories'
export const STORY_TTL_MS = 24 * 60 * 60 * 1000

function isExpired(story: Story, now = Date.now()): boolean {
  if (story.expiresAt != null) {
    return story.expiresAt <= now
  }
  return now - story.createdAt >= STORY_TTL_MS
}

function readRawStories(): Story[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed as Story[]
  } catch {
    return []
  }
}

export function saveStories(stories: Story[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
}

export function loadStories(): Story[] {
  const stories = readRawStories()
  const active = stories.filter((story) => !isExpired(story))

  if (active.length !== stories.length) {
    saveStories(active)
  }

  return active
}

export function addStory(story: Story): Story[] {
  const stories = loadStories()
  const next = [...stories, story]
  saveStories(next)
  return next
}

export function deleteStory(id: string): Story[] {
  const stories = loadStories()
  const next = stories.filter((story) => story.id !== id)
  saveStories(next)
  return next
}

export function clearExpiredStories(): Story[] {
  const stories = readRawStories()
  const active = stories.filter((story) => !isExpired(story))
  saveStories(active)
  return active
}

export function createStory(imageBase64: string): Story {
  const createdAt = Date.now()
  return {
    id: crypto.randomUUID(),
    imageBase64,
    createdAt,
    expiresAt: createdAt + STORY_TTL_MS,
  }
}
