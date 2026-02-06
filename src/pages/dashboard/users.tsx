import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Shield } from "lucide-react"

const roleColor: Record<string, "default" | "secondary" | "warning"> = { admin: "default", reseller: "warning", user: "secondary" }

const demo = [
  { id: "1", name: "Admin User", mobile: "+91 99944 72344", role: "admin" as const, login_status: "Active" as const, quota: 50000, validity: "2025-06-01", created: "2024-01-01" },
  { id: "2", name: "Rahul Sharma", mobile: "+91 98765 43210", role: "reseller" as const, login_status: "Active" as const, quota: 10000, validity: "2025-03-01", created: "2024-03-15" },
  { id: "3", name: "Priya Patel", mobile: "+91 87654 32109", role: "user" as const, login_status: "Active" as const, quota: 2000, validity: "2024-12-01", created: "2024-05-20" },
  { id: "4", name: "Amit Kumar", mobile: "+91 76543 21098", role: "user" as const, login_status: "Inactive" as const, quota: 1000, validity: "2024-10-01", created: "2024-06-10" },
  { id: "5", name: "Sneha Gupta", mobile: "+91 65432 10987", role: "reseller" as const, login_status: "Active" as const, quota: 15000, validity: "2025-01-01", created: "2024-04-01" },
  { id: "6", name: "Vikram Singh", mobile: "+91 54321 09876", role: "user" as const, login_status: "Active" as const, quota: 5000, validity: "2025-02-01", created: "2024-07-01" },
]

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const filtered = demo.filter((u) => search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.mobile.includes(search))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Users</h1><p className="text-muted-foreground">Manage platform users and resellers</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="h-4 w-4" /> Add User</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Mobile</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Quota</TableHead><TableHead>Validity</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" />{u.name}</div></TableCell>
                  <TableCell className="font-mono text-sm">{u.mobile}</TableCell>
                  <TableCell><Badge variant={roleColor[u.role]} className="capitalize">{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={u.login_status === "Active" ? "success" : "secondary"}>{u.login_status}</Badge></TableCell>
                  <TableCell>{u.quota.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.validity}</TableCell>
                  <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader><DialogTitle>Add User</DialogTitle><DialogDescription>Create a new user account</DialogDescription></DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Mobile Number" type="tel" />
            <Input placeholder="Password" type="password" />
            <Select options={[{ value: "user", label: "User" }, { value: "reseller", label: "Reseller" }, { value: "admin", label: "Admin" }]} placeholder="Select Role" />
            <Input placeholder="Quota" type="number" />
            <Input placeholder="Validity" type="date" />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button><Button>Create</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
