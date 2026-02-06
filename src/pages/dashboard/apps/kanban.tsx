import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

const columns = [
  {
    title: "To Do", color: "bg-gray-100", items: [
      { id: "1", title: "Design new campaign template", desc: "Create a Diwali-themed broadcast template", assignee: "Rahul Sharma", priority: "High" },
      { id: "2", title: "Import customer contacts", desc: "Upload the new CSV with 2000 contacts", assignee: "Priya Patel", priority: "Medium" },
    ],
  },
  {
    title: "In Progress", color: "bg-blue-50", items: [
      { id: "3", title: "Set up webhook integration", desc: "Connect webhook to CRM system", assignee: "Amit Kumar", priority: "High" },
      { id: "4", title: "Configure chatbot responses", desc: "Update FAQ bot with new product info", assignee: "Sneha Gupta", priority: "Low" },
    ],
  },
  {
    title: "Done", color: "bg-green-50", items: [
      { id: "5", title: "Launch sales campaign", desc: "Festival offer campaign sent to 5000 contacts", assignee: "Vikram Singh", priority: "High" },
      { id: "6", title: "Generate monthly report", desc: "October delivery and usage report", assignee: "Meera Joshi", priority: "Medium" },
    ],
  },
]

const priorityColor: Record<string, "destructive" | "warning" | "secondary"> = { High: "destructive", Medium: "warning", Low: "secondary" }

export function KanbanPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Kanban Board</h1><p className="text-muted-foreground">Track and organize your tasks</p></div>
        <Button><Plus className="h-4 w-4" /> Add Task</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.title} className={`rounded-lg ${col.color} p-4 min-h-[400px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{col.title}</h3>
              <Badge variant="secondary">{col.items.length}</Badge>
            </div>
            <div className="space-y-3">
              {col.items.map((item) => (
                <Card key={item.id} className="cursor-grab active:cursor-grabbing">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant={priorityColor[item.priority]}>{item.priority}</Badge>
                          <Avatar name={item.assignee} size="sm" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
