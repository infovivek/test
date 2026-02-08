import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

const demo = [
  { id: "1", phone: "+91 98765 43210", instance: "Sales-Team", message: "Hi! I wanted to ask about the sale", direction: "Incoming" as const, timestamp: "2024-11-01 10:30:00" },
  { id: "2", phone: "+91 98765 43210", instance: "Sales-Team", message: "Sure! Here's our catalog.", direction: "Outgoing" as const, timestamp: "2024-11-01 10:32:00" },
  { id: "3", phone: "+91 87654 32109", instance: "Support-Bot", message: "When will my order arrive?", direction: "Incoming" as const, timestamp: "2024-11-01 10:28:00" },
  { id: "4", phone: "+91 76543 21098", instance: "Marketing-WA", message: "Check out our new offers!", direction: "Outgoing" as const, timestamp: "2024-11-01 10:25:00" },
  { id: "5", phone: "+91 65432 10987", instance: "Sales-Team", message: "I'm interested in the premium plan", direction: "Incoming" as const, timestamp: "2024-11-01 10:20:00" },
  { id: "6", phone: "+91 54321 09876", instance: "Support-Bot", message: "Your ticket has been resolved", direction: "Outgoing" as const, timestamp: "2024-11-01 10:15:00" },
]

export function InboxReportPage() {
  const [search, setSearch] = useState("")
  const filtered = demo.filter((r) => search === "" || r.phone.includes(search) || r.message.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Inbox Report</h1><p className="text-muted-foreground">View all incoming and outgoing messages</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Input type="date" className="w-auto" />
            <Input type="date" className="w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Phone</TableHead><TableHead>Instance</TableHead><TableHead>Message</TableHead><TableHead>Direction</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.phone}</TableCell>
                  <TableCell>{r.instance}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{r.message}</TableCell>
                  <TableCell><Badge variant={r.direction === "Incoming" ? "secondary" : "success"}>{r.direction}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
