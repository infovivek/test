import { RouterProvider, createRouter, createRootRoute, createRoute, redirect } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthLayout } from "@/components/layout/auth-layout"
import { useAuthStore } from "@/stores/auth-store"

import { LoginPage } from "@/pages/auth/login"
import { RegisterPage } from "@/pages/auth/register"
import { ForgotPasswordPage } from "@/pages/auth/forgot-password"
import { DashboardPage } from "@/pages/dashboard/index"
import { InstancesPage } from "@/pages/dashboard/instances"
import { BroadcastsPage } from "@/pages/dashboard/broadcasts/index"
import { CreateBroadcastPage } from "@/pages/dashboard/broadcasts/create"
import { ChatPage } from "@/pages/dashboard/chat"
import { ChatBotsPage } from "@/pages/dashboard/chat-bots"
import { DeliveryReportPage } from "@/pages/dashboard/reports/delivery-report"
import { InboxReportPage } from "@/pages/dashboard/reports/inbox-report"
import { QueueReportPage } from "@/pages/dashboard/reports/queue-report"
import { ConnectionReportPage } from "@/pages/dashboard/reports/connection-report"
import { ExpiryReportPage } from "@/pages/dashboard/reports/expiry-report"
import { TodayUsagePage } from "@/pages/dashboard/today-usage"
import { UsersPage } from "@/pages/dashboard/users"
import { ProductsPage } from "@/pages/dashboard/products"
import { OrdersPage } from "@/pages/dashboard/orders"
import { TransactionsPage } from "@/pages/dashboard/transaction"
import { RechargeHistoryPage } from "@/pages/dashboard/recharge-history"
import { SettingsPage } from "@/pages/dashboard/settings/index"
import { ApiDocsPage } from "@/pages/dashboard/api-docs"
import { TeamChatsPage } from "@/pages/dashboard/apps/team-chats"
import { KanbanPage } from "@/pages/dashboard/apps/kanban"
import { TasksPage } from "@/pages/dashboard/apps/tasks"
import { ComingSoonPage } from "@/pages/dashboard/coming-soon"

// Root route
const rootRoute = createRootRoute()

// Index route - redirect to dashboard or login
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
    throw redirect({ to: "/auth/login" })
  },
})

// Auth layout route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthLayout,
})

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: RegisterPage,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
})

// Dashboard layout route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: DashboardPage,
})

const instancesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/instances",
  component: InstancesPage,
})

const broadcastsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/broadcasts",
  component: BroadcastsPage,
})

const broadcastsCreateRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/broadcasts/create",
  component: CreateBroadcastPage,
})

const chatRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/apps/chat",
  component: ChatPage,
})

const chatBotsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/chat-bots",
  component: ChatBotsPage,
})

const deliveryReportRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/delivery-report",
  component: DeliveryReportPage,
})

const inboxReportRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/inbox-report",
  component: InboxReportPage,
})

const queueReportRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/queue-report",
  component: QueueReportPage,
})

const connectionReportRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/connection-report",
  component: ConnectionReportPage,
})

const expiryReportRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/expiry-report",
  component: ExpiryReportPage,
})

const todayUsageRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/today-usage",
  component: TodayUsagePage,
})

const usersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/users",
  component: UsersPage,
})

const productsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/products",
  component: ProductsPage,
})

const ordersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/orders",
  component: OrdersPage,
})

const transactionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/transaction",
  component: TransactionsPage,
})

const rechargeHistoryRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/recharge-history",
  component: RechargeHistoryPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings",
  component: SettingsPage,
})

const apiDocsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/api-docs",
  component: ApiDocsPage,
})

const teamChatsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/apps/team-chats",
  component: TeamChatsPage,
})

const kanbanRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/apps/kanban",
  component: KanbanPage,
})

const tasksRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/apps/tasks",
  component: TasksPage,
})

const comingSoonRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/coming-soon",
  component: ComingSoonPage,
})

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute]),
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    instancesRoute,
    broadcastsRoute,
    broadcastsCreateRoute,
    chatRoute,
    chatBotsRoute,
    deliveryReportRoute,
    inboxReportRoute,
    queueReportRoute,
    connectionReportRoute,
    expiryReportRoute,
    todayUsageRoute,
    usersRoute,
    productsRoute,
    ordersRoute,
    transactionRoute,
    rechargeHistoryRoute,
    settingsRoute,
    apiDocsRoute,
    teamChatsRoute,
    kanbanRoute,
    tasksRoute,
    comingSoonRoute,
  ]),
])

// Create router
const router = createRouter({
  routeTree,
  trailingSlash: "never",
})

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

export default App
