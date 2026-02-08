export interface Instance {
  id: string
  instance_name: string
  phone_number: string
  connection_status: "Connected" | "Disconnected"
  webhook_status: "Enabled" | "Disabled"
  webhook_url?: string
  created_at: string
  updated_at: string
  qr_code?: string
}

export interface Broadcast {
  id: string
  name: string
  instance_name: string
  status: "Pending" | "Processing" | "Completed" | "Failed" | "Scheduled"
  total_recipients: number
  sent_count: number
  delivered_count: number
  failed_count: number
  message_type: "text" | "image" | "video" | "document"
  message_content: string
  scheduled_at?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  name: string
  phone_number: string
  avatar?: string
  last_message?: string
  last_message_time?: string
  unread_count: number
  tags?: string[]
}

export interface Message {
  id: string
  contact_id: string
  content: string
  type: "text" | "image" | "video" | "document" | "audio"
  direction: "incoming" | "outgoing"
  status: "sent" | "delivered" | "read" | "failed"
  timestamp: string
  media_url?: string
}

export interface ChatBot {
  id: string
  name: string
  instance_name: string
  is_active: boolean
  trigger_keyword: string
  response_message: string
  created_at: string
}

export interface User {
  id: string
  name: string
  mobile_number: string
  role: "admin" | "reseller" | "user"
  login_status: "Active" | "Inactive"
  quota: number
  quota_used: number
  validity: string
  reseller?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  quota: number
  validity_days: number
  is_active: boolean
}

export interface Order {
  id: string
  user_name: string
  product_name: string
  amount: number
  status: "Pending" | "Completed" | "Failed"
  created_at: string
}

export interface Transaction {
  id: string
  user_name: string
  type: "Credit" | "Debit"
  amount: number
  description: string
  created_at: string
}

export interface DeliveryReport {
  id: string
  instance_name: string
  phone_number: string
  message_type: string
  status: "Sent" | "Delivered" | "Read" | "Failed"
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
