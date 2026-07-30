import { useEffect, useRef } from 'react'
import type { Story } from '../types/story.types'
import { useStoryViewer } from '../hooks/use-story-viewer'

type StoryViewerProps = Readonly<{
  stories: Story[]
  initialIndex: number
  onClose: () => void
}>

function segmentWidth(index: number, currentIndex: number, progress: number): string {
  if (index < currentIndex) return '100%'
  if (index === currentIndex) return `${progress * 100}%`
  return '0%'
}

export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const { currentIndex, progress, goNext, goPrevious, close } = useStoryViewer({
    storyCount: stories.length,
    initialIndex,
    onClose,
  })

  const goNextRef = useRef(goNext)
  const goPreviousRef = useRef(goPrevious)
  const closeRef = useRef(close)
  goNextRef.current = goNext
  goPreviousRef.current = goPrevious
  closeRef.current = close

  const story = stories[currentIndex]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current()
      if (event.key === 'ArrowRight') goNextRef.current()
      if (event.key === 'ArrowLeft') goPreviousRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  if (!story) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
    >
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
        {stories.map((item, index) => (
          <div
            key={item.id}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className="h-full bg-white transition-[width] duration-75 ease-linear"
              style={{ width: segmentWidth(index, currentIndex, progress) }}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Close story"
        className="absolute top-5 right-4 z-20 rounded-full bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm hover:bg-black/60"
      >
        ✕
      </button>

      <img
        src={story.imageBase64}
        alt="Story"
        className="max-h-full max-w-full object-contain"
      />

      <button
        type="button"
        aria-label="Previous story"
        onClick={goPrevious}
        className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-pointer bg-transparent"
      />
      <button
        type="button"
        aria-label="Next story"
        onClick={goNext}
        className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-pointer bg-transparent"
      />
    </div>
  )
}
