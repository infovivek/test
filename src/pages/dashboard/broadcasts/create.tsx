import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { api } from "@/lib/api"
import { ArrowLeft, Send, Upload, Loader2 } from "lucide-react"

export function CreateBroadcastPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    instance_name: "",
    message_type: "text",
    message_content: "",
    media_url: "",
    audience_type: "all",
    phone_numbers: "",
    scheduled: false,
    scheduled_at: "",
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post("/broadcasts", {
        ...form,
        phone_numbers: form.phone_numbers.split("\n").filter(Boolean),
      })
      navigate({ to: "/dashboard/broadcasts" })
    } catch {
      navigate({ to: "/dashboard/broadcasts" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/broadcasts" })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Broadcast</h1>
          <p className="text-muted-foreground">Send bulk messages to your contacts</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm hidden sm:block ${s <= step ? "text-foreground" : "text-muted-foreground"}`}>
              {s === 1 ? "Details" : s === 2 ? "Audience" : "Review"}
            </span>
            {s < 3 && <div className={`h-0.5 w-8 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Set up your broadcast message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input
                placeholder="e.g., Diwali Special Offer"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instance</label>
              <Select
                value={form.instance_name}
                onChange={(e) => setForm({ ...form, instance_name: e.target.value })}
                options={[
                  { value: "Sales-Team", label: "Sales-Team" },
                  { value: "Support-Bot", label: "Support-Bot" },
                  { value: "Marketing-WA", label: "Marketing-WA" },
                ]}
                placeholder="Select instance"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Type</label>
              <Select
                value={form.message_type}
                onChange={(e) => setForm({ ...form, message_type: e.target.value })}
                options={[
                  { value: "text", label: "Text" },
                  { value: "image", label: "Image" },
                  { value: "video", label: "Video" },
                  { value: "document", label: "Document" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Content</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Type your message here..."
                value={form.message_content}
                onChange={(e) => setForm({ ...form, message_content: e.target.value })}
              />
            </div>
            {form.message_type !== "text" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Media URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={form.media_url}
                    onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!form.name || !form.instance_name || !form.message_content}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Audience</CardTitle>
            <CardDescription>Choose who receives your broadcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Audience Type</label>
              <Select
                value={form.audience_type}
                onChange={(e) => setForm({ ...form, audience_type: e.target.value })}
                options={[
                  { value: "all", label: "All Contacts" },
                  { value: "manual", label: "Manual Entry" },
                  { value: "csv", label: "Upload CSV" },
                ]}
              />
            </div>
            {form.audience_type === "manual" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Numbers (one per line)</label>
                <textarea
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder={"+919994472344\n+919876543210\n+918765432109"}
                  value={form.phone_numbers}
                  onChange={(e) => setForm({ ...form, phone_numbers: e.target.value })}
                />
              </div>
            )}
            {form.audience_type === "csv" && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Upload CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">CSV should have a 'phone' column</p>
                <Button variant="outline" className="mt-4">Choose File</Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="schedule"
                checked={form.scheduled}
                onChange={(e) => setForm({ ...form, scheduled: e.target.checked })}
              />
              <label htmlFor="schedule" className="text-sm">Schedule for later</label>
            </div>
            {form.scheduled && (
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              />
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Send</CardTitle>
            <CardDescription>Review your broadcast before sending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Campaign:</span> <span className="font-medium">{form.name}</span></div>
              <div><span className="text-muted-foreground">Instance:</span> <span className="font-medium">{form.instance_name}</span></div>
              <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{form.message_type}</span></div>
              <div><span className="text-muted-foreground">Audience:</span> <span className="font-medium capitalize">{form.audience_type}</span></div>
              {form.scheduled && (
                <div className="col-span-2"><span className="text-muted-foreground">Scheduled:</span> <span className="font-medium">{new Date(form.scheduled_at).toLocaleString()}</span></div>
              )}
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-1">Message Preview</p>
              <div className="bg-chat-outgoing rounded-lg p-3 max-w-xs">
                <p className="text-sm">{form.message_content}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {form.scheduled ? "Schedule Broadcast" : "Send Broadcast"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
