import * as React from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/stores/sidebar-store"
import { useAuthStore } from "@/stores/auth-store"
import {
  LayoutDashboard,
  Cpu,
  Send,
  MessageCircle,
  Bot,
  FileText,
  BarChart3,
  Clock,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Inbox,
  ListOrdered,
  CalendarClock,
  MessageSquare,
  KanbanSquare,
  CheckSquare,
  X,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Instances", path: "/dashboard/instances", icon: Cpu },
  { label: "Broadcasts", path: "/dashboard/broadcasts", icon: Send },
  { label: "Chat", path: "/dashboard/apps/chat", icon: MessageCircle },
  { label: "Chat Bots", path: "/dashboard/chat-bots", icon: Bot },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Delivery Report", path: "/dashboard/delivery-report", icon: FileText },
      { label: "Inbox Report", path: "/dashboard/inbox-report", icon: Inbox },
      { label: "Queue Report", path: "/dashboard/queue-report", icon: ListOrdered },
      { label: "Connection Report", path: "/dashboard/connection-report", icon: Wifi },
      { label: "Expiry Report", path: "/dashboard/expiry-report", icon: CalendarClock },
    ],
  },
  { label: "Today Usage", path: "/dashboard/today-usage", icon: Clock },
  {
    label: "Apps",
    icon: MessageSquare,
    children: [
      { label: "Team Chats", path: "/dashboard/apps/team-chats", icon: MessageSquare },
      { label: "Kanban", path: "/dashboard/apps/kanban", icon: KanbanSquare },
      { label: "Tasks", path: "/dashboard/apps/tasks", icon: CheckSquare },
    ],
  },
  { label: "Users", path: "/dashboard/users", icon: Users },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
  { label: "Transactions", path: "/dashboard/transaction", icon: CreditCard },
  { label: "Recharge History", path: "/dashboard/recharge-history", icon: History },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
  { label: "API Docs", path: "/dashboard/api-docs", icon: FileText },
]

export function Sidebar() {
  const location = useLocation()
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } = useSidebarStore()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = "/auth/login"
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar-background text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-sidebar-primary">
              Message API
            </h1>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground hidden lg:flex cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) =>
            item.children ? (
              <NavGroup
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
                currentPath={location.pathname}
              />
            ) : (
              <NavLink
                key={item.path}
                item={item as { label: string; path: string; icon: React.ComponentType<{ className?: string }> }}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path}
              />
            )
          )}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {!isCollapsed && user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-sidebar-primary-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.mobileNumber}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

function NavLink({
  item,
  isCollapsed,
  isActive,
}: {
  item: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }
  isCollapsed: boolean
  isActive: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center px-0"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  )
}

function NavGroup({
  item,
  isCollapsed,
  currentPath,
}: {
  item: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    children: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }[]
  }
  isCollapsed: boolean
  currentPath: string
}) {
  const [open, setOpen] = React.useState(
    item.children.some((c) => currentPath.startsWith(c.path))
  )
  const Icon = item.icon

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer",
          isCollapsed && "justify-center px-0"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronRight
              className={cn("h-3 w-3 transition-transform", open && "rotate-90")}
            />
          </>
        )}
      </button>
      {open && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              item={child}
              isCollapsed={false}
              isActive={currentPath === child.path}
            />
          ))}
        </div>
      )}
    </div>
  )
}
