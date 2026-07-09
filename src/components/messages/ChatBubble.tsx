import { useRef, useState, type PointerEvent } from 'react'
import { Reply, FileText, Download } from 'lucide-react'
import type { ChatMessage } from '@/types/message'
import { cn } from '@/utils/cn'

function formatFileSize(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const SWIPE_THRESHOLD = 56
const MAX_DRAG = 76

interface QuotedContent {
  quote: string
  text: string
}

export function parseQuoted(text: string): QuotedContent | null {
  if (!text.startsWith('> ')) return null
  const newlineIndex = text.indexOf('\n')
  if (newlineIndex === -1) return null
  return { quote: text.slice(2, newlineIndex), text: text.slice(newlineIndex + 1) }
}

interface ChatBubbleProps {
  message: ChatMessage
  isMine: boolean
  onReply: (message: ChatMessage) => void
}

export function ChatBubble({ message, isMine, onReply }: ChatBubbleProps) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const delta = event.clientX - startX.current
    setDragX(Math.max(0, Math.min(MAX_DRAG, delta)))
  }

  function endDrag() {
    if (dragging && dragX >= SWIPE_THRESHOLD) onReply(message)
    setDragging(false)
    setDragX(0)
  }

  const quoted = parseQuoted(message.text)
  const bodyText = quoted ? quoted.text : message.text

  return (
    <div className={cn('relative flex animate-bubble-in', isMine ? 'justify-end' : 'justify-start')}>
      <Reply
        className="pointer-events-none absolute top-1/2 left-1 size-4 shrink-0 -translate-y-1/2 text-primary transition-opacity"
        style={{ opacity: dragX > 16 ? Math.min(1, dragX / SWIPE_THRESHOLD) : 0 }}
      />
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 0.2s ease-out',
          touchAction: 'pan-y',
        }}
        className={cn(
          'max-w-[75%] cursor-grab select-none rounded-lg px-3.5 py-2 text-sm active:cursor-grabbing',
          isMine ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface',
        )}
      >
        {quoted && (
          <div
            className={cn(
              'mb-1.5 rounded-md border-l-2 px-2 py-1 text-xs opacity-80',
              isMine ? 'border-on-primary/50 bg-on-primary/10' : 'border-primary/60 bg-primary/5',
            )}
          >
            {quoted.quote}
          </div>
        )}

        {message.attachmentUrl && message.attachmentType === 'image' && (
          <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="mb-1.5 block">
            <img
              src={message.attachmentUrl}
              alt={message.attachmentName ?? 'Attachment'}
              className="max-h-64 w-full rounded-md object-cover"
            />
          </a>
        )}

        {message.attachmentUrl && message.attachmentType === 'file' && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            download={message.attachmentName}
            className={cn(
              'mb-1.5 flex items-center gap-2.5 rounded-md px-2.5 py-2',
              isMine ? 'bg-on-primary/10' : 'bg-surface',
            )}
          >
            <FileText className="size-6 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{message.attachmentName ?? 'File'}</p>
              <p className="text-[11px] opacity-70">{formatFileSize(message.attachmentSize)}</p>
            </div>
            <Download className="size-3.5 shrink-0 opacity-70" />
          </a>
        )}

        {bodyText}
      </div>
    </div>
  )
}
