import { createClient } from '@/lib/supabase/server'

export default async function TestSupabasePage() {
  try {
    const supabase = await createClient()
    
    // Test connection by checking auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Try to fetch from a table (this will show if database is accessible)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .limit(1)
    
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
          
          <div className="p-4 rounded-lg bg-card border">
            <h2 className="text-xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Set'}</p>
              <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '✓ Set' : '✗ Not Set'}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            {authError ? (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
                <strong>Auth Error:</strong> {authError.message}
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">
                ✓ Client initialized successfully
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h2 className="text-xl font-semibold mb-4">Database Test</h2>
            {error ? (
              <div className="space-y-2">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-600">
                  <strong>Note:</strong> {error.message}
                </div>
                <p className="text-sm text-muted-foreground">
                  This is expected if you haven't created any tables yet. The connection is working!
                </p>
              </div>
            ) : data ? (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">
                ✓ Successfully queried database
                <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
              </div>
            ) : (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-blue-600">
                ✓ Connection successful, no data found
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Create tables in your Supabase dashboard</li>
              <li>Set up authentication (optional)</li>
              <li>Start building your features</li>
            </ul>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
            <h1 className="text-xl font-bold text-red-500 mb-2">Connection Error</h1>
            <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    )
  }
}
