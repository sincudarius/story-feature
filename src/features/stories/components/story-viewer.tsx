import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { Story } from '../types/story.types'
import { useStoryViewer } from '../hooks/use-story-viewer'

const SWIPE_THRESHOLD_PX = 50

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
  const pointerStartX = useRef<number | null>(null)
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

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    pointerStartX.current = event.clientX
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return

    const deltaX = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      if (deltaX < 0) goNext()
      else goPrevious()
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const relativeX = event.clientX - bounds.left
    if (relativeX < bounds.width / 3) goPrevious()
    else goNext()
  }

  function handlePointerCancel() {
    pointerStartX.current = null
  }

  if (!story) return null

  return (
    <div
      className="fixed inset-0 z-50 flex touch-pan-y items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
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
        onClick={(event) => {
          event.stopPropagation()
          close()
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        aria-label="Close story"
        className="absolute top-[max(1.25rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-20 rounded-full bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm hover:bg-black/60"
      >
        ✕
      </button>

      <img
        src={story.imageBase64}
        alt="Story"
        draggable={false}
        className="max-h-full max-w-full select-none object-contain"
      />
    </div>
  )
}
