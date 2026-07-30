import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useStoriesStore } from '../store/stories.store'
import { fileToConstrainedBase64 } from '../utils/resize-image'
import { StoryAvatar } from './story-avatar'
import { StoryViewer } from './story-viewer'

export default function StoriesStrip() {
  const [stories, setStories] = useState<Story[]>([])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    function purge() {
      removeExpired()
    }

    const intervalId = window.setInterval(purge, EXPIRY_CHECK_MS)

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') purge()
    }

    window.addEventListener('focus', purge)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', purge)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [removeExpired])

  useEffect(() => {
    if (viewerIndex === null) return
    if (stories.length === 0) {
      setViewerIndex(null)
      return
    }
    if (viewerIndex >= stories.length) {
      setViewerIndex(stories.length - 1)
    }
  }, [stories, viewerIndex])

  function handleAddClick() {
    setUploadError(null)
    fileInputRef.current?.click()
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    try {
      const imageBase64 = await fileToConstrainedBase64(file)
      add(imageBase64)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not upload image'
      setUploadError(message)
    } finally {
      setIsUploading(false)
    }
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
