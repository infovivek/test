import { cn, getInitials } from "@/lib/utils"

interface AvatarProps {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium",
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
