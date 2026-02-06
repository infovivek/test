import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"

const demo = [
  { id: "1", name: "Starter Plan", description: "For small businesses", price: 999, quota: 1000, validity: 30, active: true },
  { id: "2", name: "Pro Plan", description: "For growing teams", price: 2999, quota: 5000, validity: 30, active: true },
  { id: "3", name: "Enterprise Plan", description: "Unlimited features", price: 9999, quota: 25000, validity: 30, active: true },
  { id: "4", name: "Reseller Plan", description: "For resellers & agencies", price: 19999, quota: 100000, validity: 90, active: true },
  { id: "5", name: "Trial Plan", description: "Free trial for 7 days", price: 0, quota: 100, validity: 7, active: false },
]

export function ProductsPage() {
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const filtered = demo.filter((p) => search === "" || p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-muted-foreground">Manage subscription plans and products</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="h-4 w-4" /> Add Product</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Description</TableHead><TableHead>Price</TableHead><TableHead>Quota</TableHead><TableHead>Validity</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium"><div className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" />{p.name}</div></TableCell>
                  <TableCell className="text-muted-foreground">{p.description}</TableCell>
                  <TableCell className="font-medium">&#8377;{p.price.toLocaleString()}</TableCell>
                  <TableCell>{p.quota.toLocaleString()}</TableCell>
                  <TableCell>{p.validity} days</TableCell>
                  <TableCell><Badge variant={p.active ? "success" : "secondary"}>{p.active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Product Name" /><Input placeholder="Description" /><Input placeholder="Price" type="number" /><Input placeholder="Quota" type="number" /><Input placeholder="Validity (days)" type="number" />
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button><Button>Create</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
