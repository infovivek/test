import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Circle, Calendar } from "lucide-react"

interface Task { id: string; title: string; priority: "High" | "Medium" | "Low"; due: string; done: boolean }

const priorityColor: Record<string, "destructive" | "warning" | "secondary"> = { High: "destructive", Medium: "warning", Low: "secondary" }

const initial: Task[] = [
  { id: "1", title: "Review broadcast campaign results", priority: "High", due: "2024-11-02", done: false },
  { id: "2", title: "Update chatbot FAQ responses", priority: "Medium", due: "2024-11-03", done: false },
  { id: "3", title: "Import new customer contacts", priority: "High", due: "2024-11-01", done: true },
  { id: "4", title: "Set up webhook for CRM integration", priority: "Medium", due: "2024-11-05", done: false },
  { id: "5", title: "Generate weekly usage report", priority: "Low", due: "2024-11-04", done: false },
  { id: "6", title: "Test new instance connection", priority: "High", due: "2024-11-01", done: true },
]

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initial)
  const [newTask, setNewTask] = useState("")

  const toggleTask = (id: string) => setTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([...tasks, { id: String(Date.now()), title: newTask, priority: "Medium", due: new Date().toISOString().split("T")[0], done: false }])
    setNewTask("")
  }

  const pending = tasks.filter((t) => !t.done)
  const completed = tasks.filter((t) => t.done)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Tasks</h1><p className="text-muted-foreground">Manage your to-do list</p></div>
      <div className="flex gap-2">
        <Input placeholder="Add a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} className="flex-1" />
        <Button onClick={addTask}><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Pending ({pending.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pending.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <button onClick={() => toggleTask(task.id)} className="cursor-pointer"><Circle className="h-5 w-5 text-muted-foreground" /></button>
                <div className="flex-1"><p className="text-sm font-medium">{task.title}</p><div className="flex items-center gap-2 mt-1"><Badge variant={priorityColor[task.priority]} className="text-[10px]">{task.priority}</Badge><span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{task.due}</span></div></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Completed ({completed.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {completed.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors opacity-60">
                <button onClick={() => toggleTask(task.id)} className="cursor-pointer"><Check className="h-5 w-5 text-green-600" /></button>
                <div className="flex-1"><p className="text-sm font-medium line-through">{task.title}</p><div className="flex items-center gap-2 mt-1"><Badge variant={priorityColor[task.priority]} className="text-[10px]">{task.priority}</Badge><span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{task.due}</span></div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
