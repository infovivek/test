import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { api } from "@/lib/api"
import type { ChatBot } from "@/types"
import { Plus, Search, Bot, Edit, Trash2, Power, Loader2 } from "lucide-react"

export function ChatBotsPage() {
  const [bots, setBots] = useState<ChatBot[]>(demoBots)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editBot, setEditBot] = useState<ChatBot | null>(null)
  const [form, setForm] = useState({ name: "", instance_name: "", trigger_keyword: "", response_message: "" })

  useEffect(() => {
    fetchBots()
  }, [])

  const fetchBots = async () => {
    setLoading(true)
    try {
      const res = await api.get("/chatbots")
      setBots(res.data.data || [])
    } catch {
      setBots(demoBots)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editBot) {
        await api.put(`/chatbots/${editBot.id}`, form)
      } else {
        await api.post("/chatbots", form)
      }
      setShowDialog(false)
      fetchBots()
    } catch {
      setShowDialog(false)
    }
  }

  const openCreate = () => {
    setEditBot(null)
    setForm({ name: "", instance_name: "", trigger_keyword: "", response_message: "" })
    setShowDialog(true)
  }

  const openEdit = (bot: ChatBot) => {
    setEditBot(bot)
    setForm({
      name: bot.name,
      instance_name: bot.instance_name,
      trigger_keyword: bot.trigger_keyword,
      response_message: bot.response_message,
    })
    setShowDialog(true)
  }

  const toggleBot = async (bot: ChatBot) => {
    try {
      await api.put(`/chatbots/${bot.id}`, { is_active: !bot.is_active })
      fetchBots()
    } catch {
      setBots(bots.map((b) => b.id === bot.id ? { ...b, is_active: !b.is_active } : b))
    }
  }

  const filtered = bots.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.trigger_keyword.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Chat Bots</h1>
          <p className="text-muted-foreground">Automate responses with keyword-triggered bots</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Bot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bots..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot Name</TableHead>
                <TableHead>Instance</TableHead>
                <TableHead>Trigger Keyword</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      {bot.name}
                    </div>
                  </TableCell>
                  <TableCell>{bot.instance_name}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">{bot.trigger_keyword}</code></TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{bot.response_message}</TableCell>
                  <TableCell>
                    <Badge variant={bot.is_active ? "success" : "secondary"}>
                      {bot.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleBot(bot)}>
                        <Power className={`h-4 w-4 ${bot.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(bot)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>{editBot ? "Edit Bot" : "Create Bot"}</DialogTitle>
            <DialogDescription>Configure your chatbot's trigger and response</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bot Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Welcome Bot" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instance</label>
              <Select
                value={form.instance_name}
                onChange={(e) => setForm({ ...form, instance_name: e.target.value })}
                options={[
                  { value: "Sales-Team", label: "Sales-Team" },
                  { value: "Support-Bot", label: "Support-Bot" },
                ]}
                placeholder="Select instance"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Keyword</label>
              <Input value={form.trigger_keyword} onChange={(e) => setForm({ ...form, trigger_keyword: e.target.value })} placeholder="e.g., #hello" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Message</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.response_message}
                onChange={(e) => setForm({ ...form, response_message: e.target.value })}
                placeholder="Bot response message..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editBot ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const demoBots: ChatBot[] = [
  { id: "1", name: "Welcome Bot", instance_name: "Sales-Team", is_active: true, trigger_keyword: "#hello", response_message: "Welcome! How can I help you today?", created_at: "2024-01-15T10:00:00Z" },
  { id: "2", name: "Price Bot", instance_name: "Sales-Team", is_active: true, trigger_keyword: "#price", response_message: "Our pricing starts at $9.99/month. Visit our website for details.", created_at: "2024-02-01T10:00:00Z" },
  { id: "3", name: "Support Bot", instance_name: "Support-Bot", is_active: false, trigger_keyword: "#help", response_message: "Our support team will get back to you within 24 hours.", created_at: "2024-03-10T10:00:00Z" },
  { id: "4", name: "Hours Bot", instance_name: "Support-Bot", is_active: true, trigger_keyword: "#hours", response_message: "We are available Mon-Fri 9AM to 6PM IST.", created_at: "2024-04-01T10:00:00Z" },
]
