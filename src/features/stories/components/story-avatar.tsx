type StoryAvatarProps = Readonly<{
  imageBase64: string
  alt?: string
}>

export function StoryAvatar({ imageBase64, alt = 'Story' }: StoryAvatarProps) {
  return (
    <img
      src={imageBase64}
      alt={alt}
      className="size-16 shrink-0 rounded-full object-cover ring-2 ring-slate-600"
    />
  )
}
