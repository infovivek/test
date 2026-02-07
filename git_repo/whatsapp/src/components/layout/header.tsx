import { Bell, Menu, Search } from "lucide-react"
import { useSidebarStore } from "@/stores/sidebar-store"
import { useAuthStore } from "@/stores/auth-store"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function Header() {
  const { setMobileOpen } = useSidebarStore()
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-md hover:bg-accent cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 flex items-center gap-4">
        <div className="relative hidden md:flex max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-muted border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md hover:bg-accent cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar name={user?.name || "User"} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
