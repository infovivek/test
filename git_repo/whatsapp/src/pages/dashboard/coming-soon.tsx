import { Clock } from "lucide-react"

export function ComingSoonPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Coming Soon</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  )
}
