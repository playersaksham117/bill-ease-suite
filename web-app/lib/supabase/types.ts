export interface Database {
  public: {
    Tables: {
      stock_items: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          location: string
          opening_stock: number
          stock_in: number
          stock_out: number
          adjustments: number
          closing_stock: number
          unit: string
          cost_price: number
          stock_value: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          category: string
          location: string
          opening_stock: number
          stock_in?: number
          stock_out?: number
          adjustments?: number
          closing_stock: number
          unit: string
          cost_price: number
          stock_value: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          category?: string
          location?: string
          opening_stock?: number
          stock_in?: number
          stock_out?: number
          adjustments?: number
          closing_stock?: number
          unit?: string
          cost_price?: number
          stock_value?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
