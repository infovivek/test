# BUILD: WhatsApp Business API Management Platform

Build a full-stack WhatsApp Business API management platform called "Message API Platform". Use parallel agents to maximize speed. The app has a React frontend and Node.js/Express backend with SQLite.

---

## PHASE 1: Scaffold Both Projects in Parallel

### Agent 1: Frontend Scaffold
Create the frontend project at the repo root:

**package.json dependencies:**
```json
{
  "name": "whatsapp-platform",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-router": "^1.158.0",
    "@tanstack/react-query": "^5.90.0",
    "zustand": "^5.0.0",
    "axios": "^1.13.0",
    "zod": "^4.3.0",
    "lucide-react": "^0.563.0",
    "react-icons": "^5.5.0",
    "sonner": "^2.0.0",
    "date-fns": "^4.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.5.0",
    "@tailwindcss/vite": "^4.1.0",
    "tailwindcss": "^4.1.0",
    "typescript": "~5.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "vite": "^7.0.0"
  }
}
```

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 3000,
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
})
```

**index.html** — standard Vite React template with `<div id="root">`, Google Fonts link for Inter, meta theme-color #15803d.

**tsconfig.json**, **tsconfig.app.json**, **tsconfig.node.json** — standard Vite React TS configs with path alias `@/*` → `src/*`.

Run `npm install` after creating files.

### Agent 2: Backend Scaffold
Create the backend at `server/`:

**server/package.json:**
```json
{
  "name": "whatsapp-server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts",
    "seed": "tsx src/seed.ts"
  },
  "dependencies": {
    "express": "^5.2.0",
    "better-sqlite3": "^12.6.0",
    "bcryptjs": "^3.0.0",
    "jsonwebtoken": "^9.0.0",
    "helmet": "^8.1.0",
    "cors": "^2.8.0",
    "morgan": "^1.10.0",
    "multer": "^2.0.0",
    "uuid": "^13.0.0",
    "qrcode": "^1.5.0",
    "pino": "^10.3.0",
    "@whiskeysockets/baileys": "^7.0.0-rc.9"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "~5.9.0",
    "@types/express": "^5.0.0",
    "@types/better-sqlite3": "^7.6.0",
    "@types/bcryptjs": "^3.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/cors": "^2.8.0",
    "@types/morgan": "^1.9.0",
    "@types/uuid": "^10.0.0",
    "@types/qrcode": "^1.5.0"
  }
}
```

**server/.env:**
```
PORT=4000
JWT_SECRET=whatsapp-platform-secret-key-2024
JWT_REFRESH_SECRET=whatsapp-platform-refresh-secret-2024
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DB_PATH=./data/whatsapp.db
CORS_ORIGIN=http://localhost:3000
```

**server/tsconfig.json** — target ES2022, module NodeNext, strict true, outDir dist, rootDir src.

**server/.gitignore** — node_modules, dist, data/*.db

Run `cd server && npm install` after creating files.

---

## PHASE 2: Build Core Infrastructure (Parallel Agents)

### Agent 3: Frontend Theme, Types, Stores, Utilities

**src/index.css** — Tailwind v4 theme:
```css
@import "tailwindcss";

@theme inline {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0a0a0a;
  --color-primary: #15803d;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f5f5f5;
  --color-secondary-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-accent: #f5f5f5;
  --color-accent-foreground: #171717;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #e5e5e5;
  --color-input: #e5e5e5;
  --color-ring: #15803d;
  --color-sidebar-background: #111827;
  --color-sidebar-foreground: #d1d5db;
  --color-sidebar-primary: #22c55e;
  --color-sidebar-primary-foreground: #ffffff;
  --color-sidebar-accent: #1f2937;
  --color-sidebar-accent-foreground: #f9fafb;
  --color-sidebar-border: #374151;
  --color-sidebar-ring: #22c55e;
  --color-chat-outgoing: #d9fdd3;
  --color-chat-incoming: #ffffff;
  --color-whatsapp: #25d366;
  --color-whatsapp-dark: #128c7e;
  --color-whatsapp-light: #dcf8c6;
  --radius-lg: 0.5rem;
  --radius-md: calc(0.5rem - 2px);
  --radius-sm: calc(0.5rem - 4px);
}

/* Custom animations: typing (bouncing dots 1.4s), shimmer (skeleton gradient 1.5s), slideIn (fade+translateY 0.3s) */
/* Custom scrollbar: 6px, thumb #d1d5db, hover #9ca3af */
/* Font: Inter, system-ui, sans-serif */
/* Base styles: body bg-background text-foreground antialiased */
```

**src/types/index.ts** — All TypeScript interfaces:
- `Instance`: id, instance_name, phone_number, connection_status("Connected"|"Disconnected"), webhook_status("Enabled"|"Disabled"), webhook_url?, created_at, updated_at, qr_code?
- `Broadcast`: id, name, instance_name, status("Pending"|"Processing"|"Completed"|"Failed"|"Scheduled"), total_recipients, sent_count, delivered_count, failed_count, message_type("text"|"image"|"video"|"document"), message_content, scheduled_at?, created_at, updated_at
- `Contact`: id, name, phone_number, avatar?, last_message?, last_message_time?, unread_count, tags?:string[]
- `Message`: id, contact_id, content, type("text"|"image"|"video"|"document"|"audio"), direction("incoming"|"outgoing"), status("sent"|"delivered"|"read"|"failed"), timestamp, media_url?
- `ChatBot`: id, name, instance_name, is_active:boolean, trigger_keyword, response_message, created_at
- `User`: id, name, mobile_number, role("admin"|"reseller"|"user"), login_status("Active"|"Inactive"), quota, quota_used, validity, reseller?, created_at
- `Product`: id, name, description, price, quota, validity_days, is_active:boolean
- `Order`: id, user_name, product_name, amount, status("Pending"|"Completed"|"Failed"), created_at
- `Transaction`: id, user_name, type("Credit"|"Debit"), amount, description, created_at
- `DeliveryReport`: id, instance_name, phone_number, message_type, status("Sent"|"Delivered"|"Read"|"Failed"), timestamp
- `PaginatedResponse<T>`: data:T[], total, page, limit, total_pages

**src/stores/auth-store.ts** — Zustand with persist (key "auth-storage"):
- State: tokens:{access_token,refresh_token}|null, user:{id,name,mobileNumber,role,email?}|null, isAuthenticated:boolean, isLoading:boolean
- Actions: setTokens, setUser, login(tokens,user), logout(), setLoading

**src/stores/sidebar-store.ts** — Zustand with persist (key "sidebar-storage"):
- State: isCollapsed:boolean, isMobileOpen:boolean
- Actions: toggle(), setCollapsed, setMobileOpen

**src/lib/utils.ts**:
- `cn(...inputs)` using clsx + tailwind-merge
- `formatDate(date)` → "MMM D, YYYY"
- `formatTime(date)` → "HH:MM AM/PM"
- `formatPhoneNumber(phone)` → "+XX XXXXX XXXXX"
- `getInitials(name)` → up to 2 initials
- `truncate(str, length)` → with "..."

**src/lib/api.ts** — Axios instance:
- baseURL: "/api/v1"
- Request interceptor: attach `Authorization: Bearer ${access_token}` from auth store
- Response interceptor: on 401, attempt refresh via POST /api/v1/auth/refresh, retry original request. On refresh failure, call logout() and redirect to /auth/login

### Agent 4: Backend Database, Auth, Utilities

**server/src/config/env.ts** — Read from process.env with defaults (PORT=4000, JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN=1h, JWT_REFRESH_EXPIRES_IN=7d, DB_PATH=./data/whatsapp.db, CORS_ORIGIN=http://localhost:3000)

**server/src/config/database.ts** — Initialize SQLite with better-sqlite3:
- Enable WAL mode and foreign keys pragmas
- Create all 10 tables (users, instances, contacts, messages, broadcasts, chatbots, products, orders, transactions, recharges, settings) with full schema as specified above
- Export db instance

**server/src/middleware/auth.ts**:
- `AuthRequest` interface extending Express Request with user?: {id, role, name, mobileNumber}
- `authMiddleware`: Extract Bearer token, verify JWT, lookup user in DB, attach to req.user
- `adminMiddleware`: Check req.user.role === "admin", 403 if not

**server/src/utils/jwt.ts**:
- `generateTokens({id, role})` → {access_token, refresh_token} using JWT_SECRET and JWT_REFRESH_SECRET
- `verifyRefreshToken(token)` → {id, role}

**server/src/utils/helpers.ts**:
- `generateId()` → uuid v4
- `paginate(page, limit)` → {offset, limit}
- `buildSearchClause(search, fields[])` → {clause: string, params: string[]} for SQL LIKE queries
- `now()` → "YYYY-MM-DD HH:MM:SS"

---

## PHASE 3: Build UI Components + Backend Routes (Parallel Agents)

### Agent 5: All 10 UI Components

Build custom shadcn-style components (NOT using radix). All use forwardRef where applicable.

**src/components/ui/button.tsx** — class-variance-authority variants:
- Variants: default (bg-primary green), destructive (red), outline, secondary, ghost, link
- Sizes: default (h-10 px-4 py-2), sm (h-9 px-3), lg (h-11 px-8), icon (h-10 w-10)

**src/components/ui/input.tsx** — h-10, rounded-md, border, ring focus, supports all HTML input attrs

**src/components/ui/card.tsx** — Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent. Card has rounded-lg border shadow-sm

**src/components/ui/badge.tsx** — Variants: default, secondary, destructive, outline, success (green-100/green-800), warning (yellow-100/yellow-800). Rounded-full px-2.5 py-0.5 text-xs font-semibold

**src/components/ui/dialog.tsx** — Custom modal: Dialog (conditional render + black/80 backdrop), DialogContent (max-w-lg, slideIn animation, close X), DialogHeader, DialogTitle, DialogDescription. Backdrop click closes.

**src/components/ui/select.tsx** — Native HTML select styled. Props: options:{value,label}[], placeholder?. ChevronDown overlay icon.

**src/components/ui/table.tsx** — Table (overflow-auto wrapper), TableHeader, TableBody, TableRow (hover:bg-muted/50, border-b), TableHead, TableCell

**src/components/ui/tabs.tsx** — Controlled: Tabs (value/onValueChange), TabsList, TabsTrigger (active=bg-background+shadow), TabsContent. Uses cloneElement to pass props.

**src/components/ui/avatar.tsx** — If src: img rounded-full. Else: initials in bg-primary/10 circle. Sizes: sm (h-8 w-8), md (h-10 w-10), lg (h-12 w-12)

**src/components/ui/skeleton.tsx** — div with animate-pulse rounded-md bg-muted

### Agent 6: Backend Auth + Instance + Message Routes

**server/src/routes/auth.ts** — Router with:
- POST /register: validate name/mobileNumber/password, hash password with bcryptjs, insert user, return tokens+user
- POST /login: find by mobile_number, compare password, return tokens+user (include email)
- POST /refresh: verify refresh_token, generate new pair
- GET /me: (authMiddleware) return user profile with quota/validity
- POST /forgot-password: return placeholder success message

**server/src/routes/instances.ts** — Router (all authMiddleware), scoped to req.user.id:
- GET /: list with search, connection_status, webhook_status filters + pagination
- GET /:id: single instance
- POST /: create (instance_name, webhook_url?)
- PUT /:id: update fields
- DELETE /:id: cascade delete messages+chatbots for instance, then delete instance
- GET /:id/qr: return qr_code + instance_name

**server/src/routes/messages.ts** — Router (all authMiddleware):
- POST /send-text: find instance by name+user_id, insert outgoing message, increment user quota_used, run checkChatbotTrigger (if content matches trigger_keyword, auto-insert bot response)
- POST /send-media: same but with media_url, caption, type
- GET /conversations/:instanceId: group messages by contact_phone, return last_message, last_message_time, unread_count
- GET /chat/:instanceId/:phone: paginated message history

### Agent 7: Backend CRUD Routes (broadcasts, chatbots, users, products, orders, transactions, recharges)

**server/src/routes/broadcasts.ts**:
- GET /: list with search + pagination, scoped to user
- POST /: create broadcast, then call synchronous processBroadcast() that iterates recipients[], inserts messages, updates sent/delivered/failed counts, updates user quota_used
- GET /:id: single broadcast
- DELETE /:id: delete broadcast

**server/src/routes/chatbots.ts** — CRUD scoped to user. Create needs instance lookup by name.

**server/src/routes/users.ts**:
- GET /: admin sees all, resellers see sub-users (reseller_id = req.user.id), users see only self
- POST /: admin/reseller only. Resellers auto-set reseller_id
- PUT /:id: update name/role/login_status/quota/validity/password
- DELETE /:id: adminMiddleware required

**server/src/routes/products.ts** — Full CRUD, no user scoping

**server/src/routes/orders.ts**:
- GET /: list (users see only their own)
- POST /: create from product_id, auto-add quota to user, create Credit transaction

**server/src/routes/transactions.ts** — GET / with search+pagination (users see only their own)

**server/src/routes/recharges.ts**:
- GET /: list (users see only their own)
- POST /: create recharge, add quota (amount/1), create Credit transaction

### Agent 8: Backend Reports, Settings, Contacts Routes + Server Entry + Seed

**server/src/routes/reports.ts**:
- GET /delivery: messages JOIN instances, filterable by status/date_from/date_to + search + pagination
- GET /inbox: all messages with search
- GET /queue: messages WHERE status='pending'
- GET /connection: all instances with connection info
- GET /expiry: users with computed status (Active if validity > 30 days from now, Expiring Soon if <= 30 days, Expired if past)
- GET /today-usage: messages from today, aggregate stats (total_sent, total_delivered, total_failed, total_queue)

**server/src/routes/settings.ts**:
- GET /: all settings for user as key-value object
- PUT /: upsert settings (INSERT OR REPLACE)
- GET /whitelabel: settings where key LIKE 'wl_%'
- PUT /whitelabel: upsert with auto "wl_" prefix

**server/src/routes/contacts.ts**:
- GET /: list with search
- POST /: create (name, phone_number, tags)
- DELETE /:id: delete

**server/src/index.ts** — Express server:
- Use helmet, cors(origin from env), morgan("dev"), express.json()
- Mount all route files under /api/v1/auth, /api/v1/instances, /api/v1/messages, /api/v1/broadcasts, /api/v1/chatbots, /api/v1/users, /api/v1/products, /api/v1/orders, /api/v1/transactions, /api/v1/recharges, /api/v1/reports, /api/v1/settings, /api/v1/contacts
- GET /api/health → {status:"ok", timestamp}
- Global error handler
- Listen on PORT, log startup message

**server/src/seed.ts** — Seed script:
- Admin: name="Admin", phone="+919994472344", password="919994472344" (bcrypt), role=admin, quota=100000, validity=2026-12-31
- Reseller: "Rahul Sharma", phone="+919876543210", password="password123", role=reseller, quota=50000
- 5 users: Priya Patel, Amit Kumar, Sneha Gupta, Vikram Singh, Meera Joshi (Indian phones, varying quotas, reseller_id set)
- 5 instances owned by admin: Sales-Team(Connected), Support-Bot(Connected), Marketing-WA(Disconnected), Customer-Service(Connected), Notifications(Disconnected)
- 4 chatbots: Welcome(#hello), Price(#price), Support(#help), Hours(#hours)
- 5 products: Starter ₹999/1000q/30d, Pro ₹2999/5000q/30d, Enterprise ₹9999/25000q/30d, Reseller ₹19999/100000q/90d, Trial ₹0/100q/7d
- 4 broadcasts with varying statuses and counts
- Sample messages in 2 conversations
- 3 orders (Completed), 5 transactions (Credit+Debit mix), 3 recharges (Success)

---

## PHASE 4: Build Layout Components + All Pages (Parallel Agents)

### Agent 9: Layout Components + Auth Pages

**src/components/layout/auth-layout.tsx**:
- If authenticated → redirect to /dashboard
- Split screen: left half (hidden on mobile, shown lg+) = green gradient (#15803d to #166534) with "Message API Platform" branding, 4 stats in 2x2 grid (10M+ Messages Sent, 50K+ Active Users, 99.9% Uptime, 24/7 Support), decorative circles
- Right half = white bg, renders `<Outlet />`

**src/components/layout/dashboard-layout.tsx**:
- If not authenticated → redirect to /auth/login
- Sidebar + main area with Header + Outlet
- Main shifts left margin: ml-16 when collapsed, ml-64 when expanded

**src/components/layout/sidebar.tsx** (dark themed #111827):
- Logo "Message API" in green at top
- Collapse toggle button (ChevronLeft/ChevronRight)
- Mobile: slides from left with black/50 backdrop overlay
- Nav items in order: Dashboard, Instances, Broadcasts, Chat, Chat Bots, Reports (collapsible: Delivery Report, Inbox Report, Queue Report, Connection Report, Expiry Report), Today Usage, Apps (collapsible: Team Chats, Kanban, Tasks), Users, Products, Orders, Transactions, Recharge History, Settings, API Docs
- Each item: icon + label (label hidden when collapsed)
- Active state: bg-sidebar-accent text-sidebar-primary
- NavGroup: collapsible with chevron, auto-expands when child matches current location
- Bottom: user name + mobile display, red Logout button

**src/components/layout/header.tsx**:
- Sticky top-0, h-16, border-b, white bg
- Mobile: hamburger menu button (opens sidebar)
- Search input with Search icon (hidden on mobile)
- Notification bell with red dot indicator
- User avatar + name + role (name/role hidden on mobile)

**src/pages/auth/login.tsx**:
- Card: "Welcome back" title, "Sign in to your account" subtitle
- Mobile-only logo header
- Fields: Mobile Number (tel, placeholder "+91 99944 72344"), Password (with eye toggle)
- "Remember me" checkbox, "Forgot password?" link
- "Sign In" button with loading spinner
- Error banner in red
- "Don't have an account? Register" link
- On submit: POST /api/v1/auth/login, store via useAuthStore.login(), navigate to redirect param or "/dashboard"
- Use `useSearch({ strict: false })` for redirect

**src/pages/auth/register.tsx**:
- Card: "Create an account" title
- Fields: Full Name, Mobile Number (tel), Password (min 6, eye toggle), Confirm Password
- Client-side password match validation
- POST /api/v1/auth/register
- Link to login

**src/pages/auth/forgot-password.tsx**:
- State 1: Mobile Number input + "Send Reset Link" button
- State 2: Green circle with icon + "Check your phone" confirmation message
- "Back to login" link with ArrowLeft

### Agent 10: Dashboard Index + Instances + Broadcasts Pages

**src/pages/dashboard/index.tsx**:
- "Welcome back, {user.name}" heading
- 8 stat cards in responsive grid (1-col sm, 2-col md, 4-col lg):
  1. Total Instances: 12 (blue bg, Cpu icon)
  2. Connected: 8 (green, CheckCheck)
  3. Broadcasts Sent: 156 (purple, Send)
  4. Messages Today: 2,847 (orange, MessageCircle)
  5. Active Users: 45 (indigo, Users)
  6. Pending Queue: 23 (yellow, Clock)
  7. Failed Today: 5 (red, AlertCircle)
  8. Delivery Rate: 98.5% (emerald, TrendingUp)
- Recent Activity card: 5 hardcoded items with colored status dots, action text, detail, relative time
- Message Statistics card: 4 progress bars (Sent 2450, Delivered 2380, Read 1890, Failed 5 — all out of 2847) with colored bars

**src/pages/dashboard/instances.tsx**:
- Title "WhatsApp Instances" + "New Instance" button (Plus icon)
- Filters row: Search input, Connection Status select (All/Connected/Disconnected), Webhook Status select (All/Enabled/Disabled), Refresh button
- Table: Instance Name, Phone Number, Connection (badge with Wifi/WifiOff icon), Webhook (badge), Created (formatDate), Actions
- Actions: QR Code btn, Copy btn, Settings btn, External Link btn, Delete btn (with red confirm dialog)
- Create Dialog: "Instance name" input, Cancel/Create buttons
- QR Dialog: instance name, 64x64 dashed placeholder with QrCode icon
- Skeleton loading: 3 shimmer rows
- Fetch from GET /api/v1/instances, fallback to 5 demo instances on error
- Demo instances: Sales-Team(Connected/Enabled), Support-Bot(Connected/Enabled), Marketing-WA(Disconnected/Disabled), Customer-Service(Connected/Enabled), Notifications(Disconnected/Disabled)

**src/pages/dashboard/broadcasts/index.tsx**:
- Title "Broadcasts" + "New Broadcast" link to /dashboard/broadcasts/create
- Search + Refresh filters
- Table: Campaign Name, Instance, Status (Completed=success, Processing=warning, Pending=secondary, Failed=destructive, Scheduled=default badge), Recipients, Sent(green), Delivered(blue), Failed(red), Created, Actions (eye/copy/trash2)
- Fallback: 5 demo broadcasts

**src/pages/dashboard/broadcasts/create.tsx**:
- Back button to broadcasts list
- 3-step wizard with numbered step indicators + connecting lines:
  - Step 1 "Campaign Details": Campaign Name input, Instance select (Sales-Team/Support-Bot/Marketing-WA), Message Type select (text/image/video/document), Message Content textarea, Media URL input + Upload button (shown for non-text types). Next button (disabled if empty)
  - Step 2 "Select Audience": Audience Type select (All Contacts/Manual Entry/Upload CSV). Manual=textarea for phone numbers. CSV=dashed drag-drop upload area. "Schedule for later" checkbox + datetime-local input. Back/Next buttons
  - Step 3 "Review & Send": 2x2 summary grid (Campaign, Instance, Type, Audience count), WhatsApp-style green bubble message preview, "Send Broadcast" or "Schedule Broadcast" button

### Agent 11: Chat + ChatBots + Users + Products Pages

**src/pages/dashboard/chat.tsx** (WhatsApp-style, CLIENT-SIDE ONLY):
- Full height: calc(100vh - 7rem)
- Left panel (w-80 lg:w-96): "Chats" header, Search input, scrollable contact list — each has Avatar, green online dot, name, truncated last message, time, unread count badge (blue)
- Right panel (no contact selected): centered MessageSquare icon + "Message API Chat" + subtitle
- Right panel (contact selected):
  - Header: Back arrow (mobile), Avatar, name+phone, "Online" status, action buttons (Phone, Video, MoreVertical)
  - Messages area: #f0f2f5 background with SVG cross-hatch pattern, outgoing bubbles (bg-chat-outgoing, rounded-tl-lg rounded-tr-none rounded-b-lg), incoming bubbles (bg-chat-incoming, rounded-tr-lg rounded-tl-none rounded-b-lg), time stamps, check mark icons (Check=sent, CheckCheck=delivered, blue CheckCheck=read)
  - Input area: Smile emoji btn, Paperclip btn, text input (Enter=send), Send button (shown when text) / Mic button (shown when empty)
- 8 demo contacts with online/offline status, unread counts
- 2 demo conversations for first 2 contacts
- Mobile: toggle between contacts list and chat view via showMobileChat state
- Message sending only updates local state (no API call)

**src/pages/dashboard/chat-bots.tsx**:
- Title + "New Bot" button
- Search input
- Table: Bot Name (Bot icon), Instance, Trigger Keyword (inline code style), Response (truncated max-w-[200px]), Status (Active=success/Inactive=secondary badge), Actions (Power toggle, Edit, Delete)
- Create/Edit Dialog: Bot Name, Instance select, Trigger Keyword, Response Message textarea
- Fallback: 4 demo bots

**src/pages/dashboard/users.tsx**:
- Title + "Add User" button
- Search input
- Table: Name (Shield icon), Mobile (font-mono), Role (admin=default/reseller=warning/user=secondary badge), Status (Active=success/Inactive=secondary), Quota (number), Validity (date), Actions (Edit, Delete)
- Add User Dialog: Full Name, Mobile Number (tel), Password, Role select (User/Reseller/Admin), Quota (number), Validity (date)
- Fallback: 6 demo users

**src/pages/dashboard/products.tsx**:
- Title + "Add Product" button
- Search input
- Table: Product (Package icon), Description, Price (₹ INR), Quota, Validity (X days), Status (Active/Inactive), Actions (Edit, Delete)
- Add Dialog: Product Name, Description, Price, Quota, Validity days
- Fallback: 5 demo products

### Agent 12: Orders, Transactions, Recharge, TodayUsage, Settings, ApiDocs Pages

**src/pages/dashboard/orders.tsx**:
- Title + "Export" button (Download icon)
- Search input
- Table: Order ID (font-mono truncated), User, Product, Amount (₹), Status (Completed=success/Pending=warning/Failed=destructive), Date
- 6 demo orders

**src/pages/dashboard/transaction.tsx**:
- Title "Transactions" + "Export"
- Search input
- Table: ID (mono), User, Type (Credit=success badge with ArrowDownLeft / Debit=destructive with ArrowUpRight), Amount (green +₹ for Credit / red -₹ for Debit), Description, Date
- 8 demo transactions

**src/pages/dashboard/recharge-history.tsx**:
- Title + "Export"
- Search input
- Table: ID (mono), User, Amount (₹), Plan, Method (UPI/Card/Net Banking), Status badge, Date
- 6 demo recharges

**src/pages/dashboard/today-usage.tsx**:
- Title "Today's Usage"
- 4 stat cards: Total Sent (2847, blue), Delivered (2780, green), Failed (12, red), In Queue (55, yellow)
- Search + Table: User, Instance, Sent (blue text), Delivered (green text), Failed (red text), Last Active
- 6 demo entries

**src/pages/dashboard/settings/index.tsx** — 4 Tabs:
1. General (Shield icon): Company Name, Email, Phone, Timezone in 2-col grid. "Save Changes" button
2. Notifications (Bell icon): 5 custom CSS toggle switches — Instance disconnected, Broadcast completed, New user registered, Low quota warning, Payment received. "Save" button
3. Opt-In (MessageSquare icon): Opt-In Keyword (default "START"), Opt-Out Keyword ("STOP"), Opt-In Confirmation Message textarea, Opt-Out Confirmation Message textarea. "Save" button
4. White-Label (Palette icon): Platform Name, Copyright Name, Logo URL Light, Logo URL Dark, Favicon URL, Primary Color (color picker, default #15803d). "Save" button

**src/pages/dashboard/api-docs.tsx**:
- Code icon + "API Documentation" title
- Base URL card: `https://api.yourplatform.com/api/v1` with Copy button + Bearer token note
- 5 collapsible sections (Authentication default open):
  - Authentication: POST /login, POST /register, POST /refresh with method badge, path, description, request JSON, response JSON
  - Instances: GET list, POST create, GET /:id/qr, DELETE /:id
  - Messages: POST /send-text, POST /send-media
  - Broadcasts: GET list, POST create
  - Contacts: GET list, POST add
- Method badge colors: GET=blue, POST=green, PUT=yellow, DELETE=red

### Agent 13: Report Pages + App Pages + Coming Soon

**src/pages/dashboard/reports/delivery-report.tsx**:
- Title + Export button
- Filters: Search, Status select (All/Sent/Delivered/Read/Failed), Date From (date input), Date To (date)
- Table: Phone (mono), Instance, Type (capitalize), Status (Sent=secondary/Delivered=success/Read=success/Failed=destructive badge), Timestamp
- 6 demo entries

**src/pages/dashboard/reports/inbox-report.tsx**:
- Title + Export
- Filters: Search, Date From, Date To
- Table: Phone (mono), Instance, Message (truncated max-w-[250px]), Direction (Incoming=secondary/Outgoing=success badge), Timestamp
- 6 demo entries

**src/pages/dashboard/reports/queue-report.tsx**:
- Title + Export
- Filters: Search, Status select (All/Queued/Processing/Sent/Failed)
- Table: Phone (mono), Instance, Message (truncated max-w-[200px]), Status (Queued=secondary/Processing=warning/Sent=success/Failed=destructive), Position (#N or "-"), Created
- 5 demo entries

**src/pages/dashboard/reports/connection-report.tsx**:
- Title + Export
- Filters: Search, Status select (All/Connected/Disconnected)
- Table: Instance, Phone (mono), Status (Connected with Wifi icon=success / Disconnected with WifiOff=destructive badge), Last Connected, Uptime %
- 5 demo entries

**src/pages/dashboard/reports/expiry-report.tsx**:
- Title + Export
- Filters: Search, Status select (All/Active/Expiring Soon/Expired)
- Table: User, Instance, Quota, Used, Validity (days), Expiry (date), Status (Active=success/Expired=destructive/Expiring Soon=warning badge)
- 6 demo entries

**src/pages/dashboard/apps/team-chats.tsx**:
- Title "Team Chats"
- Left panel (w-64): "Channels" header with Users icon, 5 channels: #general, #sales-team, #support, #marketing, #dev-team with unread badges
- Right panel: channel name header + member count, scrollable messages with Avatar+name+time+content, text input + Send button
- 5 demo messages in general channel. All client-side.

**src/pages/dashboard/apps/kanban.tsx**:
- Title "Kanban Board" + "Add Task" button
- 3-column grid: To Do (gray-100), In Progress (blue-50), Done (green-50)
- Column headers: title + count badge
- Task cards: GripVertical handle, title, description text, priority badge (High=destructive/Medium=warning/Low=secondary), assignee avatar
- 2 tasks per column (6 total). All client-side.

**src/pages/dashboard/apps/tasks.tsx**:
- Title "Tasks"
- Add task: text input + "Add" button (Enter key support)
- 2-column: Pending / Completed
- Each task: Circle/CheckCircle2 toggle, title (strikethrough when done), priority badge, due date with Calendar icon
- 6 initial tasks (4 pending, 2 completed). Toggle moves between columns. All client-side.

**src/pages/dashboard/coming-soon.tsx**:
- Centered: Clock icon in primary/10 bg circle, "Coming Soon" h1, "We're working hard to bring you this feature. Stay tuned for updates!" paragraph

---

## PHASE 5: Router + Entry Point + Final Assembly

### Agent 14: App.tsx Router + main.tsx

**src/main.tsx**:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
```

**src/App.tsx** — Define ALL routes using TanStack Router (code-based, NOT file-based):
- Import ALL page components
- Create rootRoute with `createRootRoute`
- Create authRoute (path "/auth", component AuthLayout)
- Create dashboardRoute (path "/dashboard", component DashboardLayout)
- Create all leaf routes as children
- Build routeTree: rootRoute.addChildren([indexRoute, authRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute]), dashboardRoute.addChildren([...all dashboard routes])])
- Index route ("/") uses `beforeLoad` to redirect based on auth state
- Dashboard route uses `beforeLoad` to check auth and redirect to /auth/login?redirect=$path if not authenticated
- Create router with `createRouter({ routeTree, trailingSlash: "never" })`
- Create QueryClient with `defaultOptions: { queries: { staleTime: 5*60*1000, retry: 1 } }`
- App component renders `<QueryClientProvider><RouterProvider router={router} /></QueryClientProvider>`
- Declare module '@tanstack/react-router' { interface Register { router: typeof router } }

---

## PHASE 6: Run Everything

After all agents complete:

1. `cd server && npx tsx src/seed.ts` — seed the database
2. `cd server && npm run dev` — start backend on port 4000 (run in background)
3. `npm run dev` — start frontend on port 3000
4. `npm run build` — verify production build succeeds with no errors

**Login credentials:** Phone: +919994472344, Password: 919994472344

---

## CRITICAL RULES

1. **Every frontend page MUST have hardcoded fallback demo data** — the UI must work fully without the backend running.
2. **Currency is Indian Rupees (₹)** — use the rupee symbol for all prices.
3. **Chat page is entirely client-side** — no API calls for messages.
4. **Apps section (Team Chats, Kanban, Tasks) are client-side only** — no backend persistence.
5. **TanStack Router must use code-based routes in App.tsx** with `trailingSlash: "never"`. Use `useSearch({ strict: false })` for search params.
6. **Import order matters** — React imports must be at the top of every file.
7. **No radix-ui** — all Dialog, Select, Tabs are custom implementations.
8. **Tailwind CSS v4** — use `@import "tailwindcss"` + `@theme inline {}` in CSS, NOT tailwind.config.js.
9. Do NOT add pagination controls to the frontend — backend supports it but UI doesn't show page navigation.
10. All agents should create complete, working files — no TODOs or placeholders in code.
