import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


type StoryBarItem = {
  id: string
  image: string
}

type StoryBarState = {
  stories: StoryBarItem[]
  addStory: (story: StoryBarItem) => void
  removeStory: (id: string) => void
}

export const useStoryBarStore = create<StoryBarState>()(persist((set) => ({
  stories: [],
  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
  removeStory: (id) => set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),
}), {
  name: 'story-bar',
  storage: createJSONStorage(() => localStorage),
}));