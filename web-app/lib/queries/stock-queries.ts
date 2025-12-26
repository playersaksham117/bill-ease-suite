import { createClient } from '@/lib/supabase/client';
import { StockReportItem } from '@/types/stock';

export interface StockQueryFilters {
  userId: string;
  categoryFilter?: string;
  locationFilter?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Optimized query with selective fields and proper indexing
export async function fetchStockItems(filters: StockQueryFilters): Promise<StockReportItem[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('stock_items')
    .select(`
      id,
      name,
      sku,
      category,
      location,
      opening_stock,
      stock_in,
      stock_out,
      adjustments,
      closing_stock,
      unit,
      cost_price,
      stock_value,
      created_at,
      updated_at
    `)
    .eq('user_id', filters.userId)
    .order('name', { ascending: true });

  // Apply filters
  if (filters.categoryFilter && filters.categoryFilter !== 'All') {
    query = query.eq('category', filters.categoryFilter);
  }

  if (filters.locationFilter && filters.locationFilter !== 'All') {
    query = query.eq('location', filters.locationFilter);
  }

  if (filters.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,sku.ilike.%${filters.searchQuery}%`);
  }

  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Transform data to match component interface
  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    location: item.location,
    openingStock: item.opening_stock,
    stockIn: item.stock_in,
    stockOut: item.stock_out,
    adjustments: item.adjustments,
    closingStock: item.closing_stock,
    unit: item.unit,
    costPrice: item.cost_price,
    stockValue: item.stock_value,
  }));
}

// Fetch unique categories for the user (cached)
export async function fetchCategories(userId: string): Promise<string[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('stock_items')
    .select('category')
    .eq('user_id', userId);

  if (error) throw error;

  const uniqueCategories = ['All', ...new Set((data || []).map((item: any) => item.category))];
  return uniqueCategories;
}

// Fetch unique locations for the user (cached)
export async function fetchLocations(userId: string): Promise<string[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('stock_items')
    .select('location')
    .eq('user_id', userId);

  if (error) throw error;

  const uniqueLocations = ['All', ...new Set((data || []).map((item: any) => item.location))];
  return uniqueLocations;
}

// Get user profile with caching
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}
