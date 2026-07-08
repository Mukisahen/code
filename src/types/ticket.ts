export interface MyTicket {
  id: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
}
