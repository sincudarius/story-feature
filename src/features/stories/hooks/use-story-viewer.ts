import { useEffect, useRef, useState } from 'react'

export const STORY_DURATION_MS = 5000

type UseStoryViewerOptions = Readonly<{
  storyCount: number
  initialIndex: number
  durationMs?: number
  onClose: () => void
}>

function startProgressTimer(
  durationMs: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  isCancelled: () => boolean,
): () => void {
  const start = performance.now()
  let frameId = 0

  function tick(now: number) {
    if (isCancelled()) return

    const nextProgress = Math.min(1, (now - start) / durationMs)
    onProgress(nextProgress)

    if (nextProgress < 1) {
      frameId = requestAnimationFrame(tick)
      return
    }

    onComplete()
  }

  frameId = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frameId)
}

export function useStoryViewer({
  storyCount,
  initialIndex,
  durationMs = STORY_DURATION_MS,
  onClose,
}: UseStoryViewerOptions) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)
  const onCloseRef = useRef(onClose)
  const currentIndexRef = useRef(currentIndex)
  onCloseRef.current = onClose
  currentIndexRef.current = currentIndex

  useEffect(() => {
    let cancelled = false

    function handleComplete() {
      const index = currentIndexRef.current
      if (index >= storyCount - 1) {
        if (!cancelled) onCloseRef.current()
        return
      }
      setCurrentIndex(index + 1)
    }

    setProgress(0)
    const stop = startProgressTimer(
      durationMs,
      setProgress,
      handleComplete,
      () => cancelled,
    )

    return () => {
      cancelled = true
      stop()
    }
  }, [currentIndex, durationMs, storyCount])

  function goNext() {
    if (currentIndex >= storyCount - 1) {
      onCloseRef.current()
      return
    }
    setCurrentIndex(currentIndex + 1)
    setProgress(0)
  }

  function goPrevious() {
    if (currentIndex <= 0) {
      setProgress(0)
      return
    }
    setCurrentIndex(currentIndex - 1)
    setProgress(0)
  }

  function close() {
    onCloseRef.current()
  }

  return {
    currentIndex,
    progress,
    goNext,
    goPrevious,
    close,
  }
}
