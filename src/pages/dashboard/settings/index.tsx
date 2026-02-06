import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bell, Shield, Palette, MessageSquare, Save } from "lucide-react"

export function SettingsPage() {
  const [tab, setTab] = useState("general")

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your platform settings</p></div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="general"><Shield className="h-4 w-4 mr-1" />General</TabsTrigger>
          <TabsTrigger value="notification"><Bell className="h-4 w-4 mr-1" />Notifications</TabsTrigger>
          <TabsTrigger value="optin"><MessageSquare className="h-4 w-4 mr-1" />Opt-In</TabsTrigger>
          <TabsTrigger value="whitelabel"><Palette className="h-4 w-4 mr-1" />White-Label</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Manage account information</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Company Name</label><Input defaultValue="My Company" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input defaultValue="admin@company.com" type="email" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input defaultValue="+91 99944 72344" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Timezone</label><Input defaultValue="Asia/Kolkata" /></div>
              </div>
              <Button><Save className="h-4 w-4" /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notification">
          <Card>
            <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Configure how you receive notifications</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {["Instance disconnected", "Broadcast completed", "New user registered", "Low quota warning", "Payment received"].map((label) => (
                <div key={label} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">Receive notification when this event occurs</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
              <Button><Save className="h-4 w-4" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="optin">
          <Card>
            <CardHeader><CardTitle>Opt-In / Opt-Out Settings</CardTitle><CardDescription>Manage message consent preferences</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Opt-In Keyword</label><Input defaultValue="START" /><p className="text-xs text-muted-foreground">Users send this keyword to subscribe</p></div>
              <div className="space-y-2"><label className="text-sm font-medium">Opt-Out Keyword</label><Input defaultValue="STOP" /><p className="text-xs text-muted-foreground">Users send this keyword to unsubscribe</p></div>
              <div className="space-y-2"><label className="text-sm font-medium">Opt-In Confirmation Message</label>
                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Thank you for subscribing! You'll now receive our updates." />
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Opt-Out Confirmation Message</label>
                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="You've been unsubscribed. Send START to resubscribe." />
              </div>
              <Button><Save className="h-4 w-4" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="whitelabel">
          <Card>
            <CardHeader><CardTitle>White-Label Settings</CardTitle><CardDescription>Customize branding for your platform</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Platform Name</label><Input defaultValue="Message API Platform" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Copyright Name</label><Input defaultValue="My Company" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Logo URL (Light)</label><Input placeholder="https://example.com/logo-light.png" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Logo URL (Dark)</label><Input placeholder="https://example.com/logo-dark.png" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Favicon URL</label><Input placeholder="https://example.com/favicon.ico" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Primary Color</label><Input type="color" defaultValue="#15803d" className="h-10" /></div>
              </div>
              <Button><Save className="h-4 w-4" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
