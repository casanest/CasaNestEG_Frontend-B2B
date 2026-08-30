import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface QuoteItem {
  id: string
  productId: string
  variantId: string
  productHandle: string
  productTitle: string
  productTitleAr?: string
  productDescription?: string
  productDescriptionAr?: string
  thumbnail: string | null
  images: { url: string }[]
  quantity: number
  variantTitle?: string
  variantTitleAr?: string
  variantOptions?: { option_id: string; value: string; metadata?: any }[]
  variantMetadata?: Record<string, any>
  productMetadata?: Record<string, any>
  unitPrice: number | null
  originalPrice: number | null
  currencyCode: string
  categoryName?: string
  categoryNameAr?: string
  categoryMetadata?: any
  manageInventory?: boolean
  allowBackorder?: boolean
  inventoryQuantity?: number
  minOrderQty?: number
  createdAt: string
}

interface CartStore {
  items: QuoteItem[]
  isOpenCartDropdown: boolean
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  addItem: (item: Omit<QuoteItem, 'id' | 'createdAt'> & { id?: string }) => void
  updateItemQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearItems: () => void
  openCartDropdown: () => void
  closeCartDropdown: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpenCartDropdown: false,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (existing) => existing.variantId === item.variantId
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + (item.quantity || 1),
            }
            return { items: updatedItems }
          }

          const newItem: QuoteItem = {
            ...item,
            id: item.id || item.variantId,
            createdAt: new Date().toISOString(),
          }

          return { items: [...state.items, newItem] }
        }),
      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearItems: () => set({ items: [] }),
      openCartDropdown: () => set({ isOpenCartDropdown: true }),
      closeCartDropdown: () => set({ isOpenCartDropdown: false }),
    }),
    {
      name: 'casanest-quote-list',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
