import { api } from '@/lib/apiClient'
import type { MyTicket } from '@/types/ticket'

function toClientStatus(status: string): MyTicket['status'] {
  return status === 'in_progress' ? 'in-progress' : (status as MyTicket['status'])
}

export async function listMyTickets(): Promise<MyTicket[]> {
  const { tickets } = await api.get<{ tickets: (Omit<MyTicket, 'status'> & { status: string })[] }>('/tickets/mine')
  return tickets.map((t) => ({ ...t, status: toClientStatus(t.status) }))
}

export interface CreateTicketPayload {
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
}

export async function createTicket(payload: CreateTicketPayload): Promise<MyTicket> {
  const { ticket } = await api.post<{ ticket: Omit<MyTicket, 'status'> & { status: string } }>('/tickets', payload)
  return { ...ticket, status: toClientStatus(ticket.status) }
}
