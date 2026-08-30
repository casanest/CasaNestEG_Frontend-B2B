import { create } from 'zustand'

export interface RfqItem {
  productId: string
  productTitle: string
  quantity: number
  thumbnail: string | null
  categoryName?: string
}

interface RfqStore {
  items: RfqItem[]
  setItems: (items: RfqItem[]) => void
  clear: () => void
}

export const useRfqStore = create<RfqStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  clear: () => set({ items: [] }),
}))
