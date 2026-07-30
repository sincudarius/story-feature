import { create } from 'zustand'
import type { Story } from '../types/story.types'
import {
  addStory as persistAddStory,
  clearExpiredStories,
  createStory,
  loadStories,
} from '../services/stories.storage'

type StoriesState = {
  stories: Story[]
  hydrate: () => void
  add: (imageBase64: string) => void
  removeExpired: () => void
}

export const useStoriesStore = create<StoriesState>((set) => ({
  stories: [],

  hydrate: () => {
    set({ stories: loadStories() })
  },

  add: (imageBase64: string) => {
    const story = createStory(imageBase64)
    set({ stories: persistAddStory(story) })
  },

  removeExpired: () => {
    set({ stories: clearExpiredStories() })
  },
}))
