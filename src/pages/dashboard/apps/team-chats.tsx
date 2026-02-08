import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Hash, Users } from "lucide-react"

const channels = [
  { id: "1", name: "general", members: 12, unread: 3 },
  { id: "2", name: "sales-team", members: 5, unread: 0 },
  { id: "3", name: "support", members: 8, unread: 1 },
  { id: "4", name: "marketing", members: 4, unread: 0 },
  { id: "5", name: "dev-team", members: 6, unread: 5 },
]

const messages = [
  { id: "1", user: "Rahul Sharma", content: "Hey team, the new campaign is ready!", time: "10:30 AM" },
  { id: "2", user: "Priya Patel", content: "Great! I'll review it now.", time: "10:32 AM" },
  { id: "3", user: "Amit Kumar", content: "Can we add more contacts to the list?", time: "10:35 AM" },
  { id: "4", user: "Sneha Gupta", content: "I've uploaded the new CSV file with 500 contacts.", time: "10:40 AM" },
  { id: "5", user: "Rahul Sharma", content: "Perfect, let's schedule it for tomorrow morning.", time: "10:42 AM" },
]

export function TeamChatsPage() {
  const [selected, setSelected] = useState(channels[0])
  const [input, setInput] = useState("")

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold">Team Chats</h1><p className="text-muted-foreground">Internal team communication</p></div>
      <div className="flex h-[calc(100vh-12rem)] rounded-lg border overflow-hidden">
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-3 border-b font-medium text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Channels</div>
          <div className="flex-1 overflow-y-auto">
            {channels.map((ch) => (
              <button key={ch.id} onClick={() => setSelected(ch)} className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer", selected.id === ch.id && "bg-muted font-medium")}>
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left">{ch.name}</span>
                {ch.unread > 0 && <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1">{ch.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b flex items-center gap-2"><Hash className="h-4 w-4" /><span className="font-medium">{selected.name}</span><span className="text-xs text-muted-foreground">{selected.members} members</span></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Avatar name={msg.user} size="sm" />
                <div><div className="flex items-center gap-2"><span className="text-sm font-medium">{msg.user}</span><span className="text-xs text-muted-foreground">{msg.time}</span></div><p className="text-sm mt-0.5">{msg.content}</p></div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <Input placeholder={`Message #${selected.name}`} value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
