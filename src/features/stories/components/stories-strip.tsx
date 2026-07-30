import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { Story } from '../types/story.types'
import { addStory, createStory, loadStories } from '../services/stories.storage'
import { StoryAvatar } from './story-avatar'
import { StoryViewer } from './story-viewer'

export default function StoriesStrip() {
  const [stories, setStories] = useState<Story[]>([])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setStories(loadStories())
  }, [])

  function handleAddClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      const story = createStory(reader.result)
      setStories(addStory(story))
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="w-full border-b border-slate-800 bg-slate-950">
        <div className="flex w-full items-center gap-3 overflow-x-auto px-4 py-3">
          <button
            type="button"
            onClick={handleAddClick}
            aria-label="Add story"
            className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-500 text-2xl text-slate-300 transition hover:border-slate-300 hover:text-white"
          >
            +
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {stories.length === 0 ? (
            <p className="shrink-0 text-sm text-slate-500">No stories yet</p>
          ) : (
            stories.map((story, index) => (
              <StoryAvatar
                key={story.id}
                imageBase64={story.imageBase64}
                onClick={() => setViewerIndex(index)}
              />
            ))
          )}
        </div>
      </div>

      {viewerIndex !== null && stories.length > 0 ? (
        <StoryViewer
          stories={stories}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      ) : null}
    </>
  )
}
