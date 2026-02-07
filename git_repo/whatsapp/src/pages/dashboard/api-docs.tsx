import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Code, ChevronDown, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-green-100 text-green-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
}

const sections = [
  {
    title: "Authentication",
    endpoints: [
      { method: "POST", path: "/api/v1/auth/login", desc: "Login with credentials", body: '{ "mobileNumber": "+919994472344", "password": "***" }', response: '{ "tokens": { "access_token": "...", "refresh_token": "..." }, "user": { ... } }' },
      { method: "POST", path: "/api/v1/auth/register", desc: "Register new account", body: '{ "name": "John", "mobileNumber": "+91...", "password": "***" }', response: '{ "tokens": { ... }, "user": { ... } }' },
      { method: "POST", path: "/api/v1/auth/refresh", desc: "Refresh access token", body: '{ "refresh_token": "..." }', response: '{ "access_token": "...", "refresh_token": "..." }' },
    ],
  },
  {
    title: "Instances",
    endpoints: [
      { method: "GET", path: "/api/v1/instances", desc: "List all instances", body: "", response: '{ "data": [...], "total": 5 }' },
      { method: "POST", path: "/api/v1/instances", desc: "Create new instance", body: '{ "instance_name": "My-Instance" }', response: '{ "id": "...", "instance_name": "My-Instance", ... }' },
      { method: "GET", path: "/api/v1/instances/:id/qr", desc: "Get QR code for connection", body: "", response: '{ "qr_code": "base64..." }' },
      { method: "DELETE", path: "/api/v1/instances/:id", desc: "Delete an instance", body: "", response: '{ "message": "Deleted" }' },
    ],
  },
  {
    title: "Messages",
    endpoints: [
      { method: "POST", path: "/api/v1/messages/send-text", desc: "Send text message", body: '{ "instance_name": "...", "phone": "+91...", "message": "Hello!" }', response: '{ "id": "...", "status": "sent" }' },
      { method: "POST", path: "/api/v1/messages/send-media", desc: "Send media message", body: '{ "instance_name": "...", "phone": "+91...", "media_url": "...", "caption": "..." }', response: '{ "id": "...", "status": "sent" }' },
    ],
  },
  {
    title: "Broadcasts",
    endpoints: [
      { method: "GET", path: "/api/v1/broadcasts", desc: "List all broadcasts", body: "", response: '{ "data": [...], "total": 10 }' },
      { method: "POST", path: "/api/v1/broadcasts", desc: "Create broadcast campaign", body: '{ "name": "...", "instance_name": "...", "message": "...", "recipients": [...] }', response: '{ "id": "...", "status": "Pending" }' },
    ],
  },
  {
    title: "Contacts",
    endpoints: [
      { method: "GET", path: "/api/v1/contacts", desc: "List contacts", body: "", response: '{ "data": [...] }' },
      { method: "POST", path: "/api/v1/contacts", desc: "Add contact", body: '{ "name": "...", "phone": "+91..." }', response: '{ "id": "...", "name": "..." }' },
    ],
  },
]

export function ApiDocsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Authentication: true })

  const toggle = (section: string) => setExpanded({ ...expanded, [section]: !expanded[section] })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Code className="h-6 w-6 text-primary" />
        <div><h1 className="text-2xl font-bold">API Documentation</h1><p className="text-muted-foreground">Integrate with the Message API Platform</p></div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Base URL</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-muted rounded-md p-3 font-mono text-sm">
            <span className="flex-1">https://v2.enotify.app/api/v1</span>
            <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">All API requests require a Bearer token in the Authorization header.</p>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader className="cursor-pointer" onClick={() => toggle(section.title)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {expanded[section.title] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
          </CardHeader>
          {expanded[section.title] && (
            <CardContent className="space-y-4">
              {section.endpoints.map((ep, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold", methodColors[ep.method])}>{ep.method}</span>
                    <code className="text-sm font-mono">{ep.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{ep.desc}</p>
                  {ep.body && (
                    <div className="mb-2"><p className="text-xs font-medium mb-1">Request Body:</p><pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{ep.body}</pre></div>
                  )}
                  <div><p className="text-xs font-medium mb-1">Response:</p><pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{ep.response}</pre></div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
