import { create } from 'zustand'

export interface Chatroom {
  id: string
  title: string
  createdAt: number
}

interface ChatState {
  chatrooms: Chatroom[]
  createChatroom: (title: string) => void
  deleteChatroom: (id: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const loadFromStorage = (): Chatroom[] => {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('chatrooms')
  return raw ? JSON.parse(raw) : []
}

const saveToStorage = (chatrooms: Chatroom[]) => {
  localStorage.setItem('chatrooms', JSON.stringify(chatrooms))
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatrooms: loadFromStorage(),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  createChatroom: (title) => {
    const newRoom: Chatroom = { id: crypto.randomUUID(), title, createdAt: Date.now() }
    const updated = [...get().chatrooms, newRoom]
    saveToStorage(updated)
    set({ chatrooms: updated })
  },
  deleteChatroom: (id) => {
    const updated = get().chatrooms.filter(r => r.id !== id)
    saveToStorage(updated)
    set({ chatrooms: updated })
  }
}))
