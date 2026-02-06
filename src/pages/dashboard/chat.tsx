import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  ArrowLeft,
  Image,
  File,
  Mic,
} from "lucide-react"

interface ChatContact {
  id: string
  name: string
  phone: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  avatar?: string
}

interface ChatMessage {
  id: string
  content: string
  time: string
  direction: "incoming" | "outgoing"
  status?: "sent" | "delivered" | "read"
}

const demoContacts: ChatContact[] = [
  { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", lastMessage: "Thank you for the update!", lastTime: "10:30 AM", unread: 2, online: true },
  { id: "2", name: "Priya Patel", phone: "+91 87654 32109", lastMessage: "When will the delivery arrive?", lastTime: "9:45 AM", unread: 0, online: true },
  { id: "3", name: "Amit Kumar", phone: "+91 76543 21098", lastMessage: "I'm interested in the offer", lastTime: "Yesterday", unread: 5, online: false },
  { id: "4", name: "Sneha Gupta", phone: "+91 65432 10987", lastMessage: "Please send the invoice", lastTime: "Yesterday", unread: 0, online: false },
  { id: "5", name: "Vikram Singh", phone: "+91 54321 09876", lastMessage: "Got it, thanks!", lastTime: "Monday", unread: 0, online: true },
  { id: "6", name: "Meera Joshi", phone: "+91 43210 98765", lastMessage: "Can you share the catalog?", lastTime: "Monday", unread: 1, online: false },
  { id: "7", name: "Arjun Reddy", phone: "+91 32109 87654", lastMessage: "I'll check and get back to you", lastTime: "Sunday", unread: 0, online: false },
  { id: "8", name: "Kavita Nair", phone: "+91 21098 76543", lastMessage: "Payment completed", lastTime: "Sunday", unread: 0, online: true },
]

const demoMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", content: "Hi! I wanted to ask about the Diwali sale", time: "10:15 AM", direction: "incoming" },
    { id: "m2", content: "Hello Rahul! Yes, we have amazing offers this Diwali. Up to 50% off on selected products!", time: "10:18 AM", direction: "outgoing", status: "read" },
    { id: "m3", content: "That sounds great! Can you send me the catalog?", time: "10:20 AM", direction: "incoming" },
    { id: "m4", content: "Sure! Here's our Diwali special catalog. Let me know if you need anything else.", time: "10:25 AM", direction: "outgoing", status: "read" },
    { id: "m5", content: "Thank you for the update!", time: "10:30 AM", direction: "incoming" },
  ],
  "2": [
    { id: "m1", content: "Hello, I placed an order yesterday", time: "9:30 AM", direction: "incoming" },
    { id: "m2", content: "Hi Priya! Let me check your order status.", time: "9:35 AM", direction: "outgoing", status: "delivered" },
    { id: "m3", content: "Your order #12345 is out for delivery and should arrive by 5 PM today.", time: "9:38 AM", direction: "outgoing", status: "delivered" },
    { id: "m4", content: "When will the delivery arrive?", time: "9:45 AM", direction: "incoming" },
  ],
}

export function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [showMobileChat, setShowMobileChat] = useState(false)

  const filteredContacts = demoContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  )

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact)
    setMessages(demoMessages[contact.id] || [])
    setShowMobileChat(true)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      direction: "outgoing",
      status: "sent",
    }
    setMessages([...messages, newMsg])
    setMessageInput("")
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-lg border overflow-hidden bg-background">
      {/* Contact List */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r flex flex-col bg-background",
          showMobileChat && "hidden md:flex"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={cn(
                "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer",
                selectedContact?.id === contact.id && "bg-muted"
              )}
            >
              <div className="relative">
                <Avatar name={contact.name} size="md" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <span className="text-xs text-muted-foreground">{contact.lastTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !showMobileChat && !selectedContact && "hidden md:flex"
        )}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b bg-background">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar name={selectedContact.name} size="md" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedContact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.online ? "Online" : "Offline"} • {selectedContact.phone}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundColor: "#f0f2f5",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.direction === "outgoing" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 shadow-sm",
                      msg.direction === "outgoing"
                        ? "bg-chat-outgoing rounded-tr-none"
                        : "bg-chat-incoming rounded-tl-none"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      {msg.direction === "outgoing" && (
                        <span className={cn("text-[10px]", msg.status === "read" ? "text-blue-500" : "text-muted-foreground")}>
                          {msg.status === "read" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t bg-background">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                </div>
                {messageInput.trim() ? (
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Image className="h-3 w-3" /> Image
                </Button>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <File className="h-3 w-3" /> Document
                </Button>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Video className="h-3 w-3" /> Video
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Message API Chat</h2>
              <p className="text-muted-foreground max-w-sm">
                Select a contact to start chatting. Send and receive WhatsApp messages in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
