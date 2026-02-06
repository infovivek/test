import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { api } from "@/lib/api"
import { MessageCircle, Loader2, ArrowLeft } from "lucide-react"

export function ForgotPasswordPage() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.post("/auth/forgot-password", {
        mobileNumber: mobileNumber.replace(/\s/g, ""),
      })
      setSent(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr.response?.data?.message || "Failed to send reset link.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <MessageCircle className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">Message API</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {sent
              ? "A password reset link has been sent to your phone."
              : "Enter your mobile number to reset your password."}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <Input
                  type="tel"
                  placeholder="+91 99944 72344"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <p className="text-sm text-muted-foreground">
                Check your phone for the password reset instructions.
              </p>
            </div>
          </CardContent>
        )}
        <CardFooter>
          <Link to="/auth/login" className="flex items-center gap-2 text-sm text-primary hover:underline mx-auto">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
