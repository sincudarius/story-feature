type StoryAvatarProps = Readonly<{
  imageBase64: string
  alt?: string
  onClick?: () => void
}>

export function StoryAvatar({ imageBase64, alt = 'Story', onClick }: StoryAvatarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-400"
    >
      <img
        src={imageBase64}
        alt=""
        className="size-16 rounded-full object-cover ring-2 ring-slate-600"
      />
    </button>
  )
}
