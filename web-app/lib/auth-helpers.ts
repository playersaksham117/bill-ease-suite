import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if user has access to a specific tool
 */
export async function hasToolAccess(userId: string, tool: string): Promise<boolean> {
  // In future, you can check subscription or permissions from database
  // For now, all authenticated users have access to all tools
  return true;
}
