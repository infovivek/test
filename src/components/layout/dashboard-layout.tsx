import { Outlet, Navigate } from "@tanstack/react-router"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuthStore } from "@/stores/auth-store"
import { useSidebarStore } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore()
  const { isCollapsed } = useSidebarStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Header />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
