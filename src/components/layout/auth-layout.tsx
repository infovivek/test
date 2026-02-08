import { Outlet, Navigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth-store"
import { MessageCircle } from "lucide-react"

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <MessageCircle className="h-20 w-20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Message API Platform</h1>
          <p className="text-lg opacity-90">
            The most powerful WhatsApp Business API platform with broadcasting,
            chatbots, team inbox, and comprehensive reporting.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold text-2xl">10M+</p>
              <p className="opacity-75">Messages Sent</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold text-2xl">50K+</p>
              <p className="opacity-75">Active Users</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold text-2xl">99.9%</p>
              <p className="opacity-75">Uptime</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold text-2xl">24/7</p>
              <p className="opacity-75">Support</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Outlet />
      </div>
    </div>
  )
}
