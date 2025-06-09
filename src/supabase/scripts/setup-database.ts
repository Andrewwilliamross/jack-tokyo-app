import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { authConfig } from '../config/auth-config'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Starting database setup...')

    // 1. Create profiles table
    console.log('Creating profiles table...')
    const { error: profilesError } = await supabase.rpc('create_profiles_table')
    if (profilesError) throw profilesError
    console.log('Profiles table created successfully')

    // 2. Create user_settings table
    console.log('Creating user_settings table...')
    const { error: settingsError } = await supabase.rpc('create_user_settings_table')
    if (settingsError) throw settingsError
    console.log('User settings table created successfully')

    // 3. Enable RLS
    console.log('Enabling Row Level Security...')
    const { error: rlsError } = await supabase.rpc('enable_rls')
    if (rlsError) throw rlsError
    console.log('RLS enabled successfully')

    // 4. Create policies
    console.log('Creating security policies...')
    const { error: policiesError } = await supabase.rpc('create_security_policies')
    if (policiesError) throw policiesError
    console.log('Security policies created successfully')

    // 5. Create triggers
    console.log('Creating database triggers...')
    const { error: triggersError } = await supabase.rpc('create_triggers')
    if (triggersError) throw triggersError
    console.log('Database triggers created successfully')

    // 6. Configure authentication settings
    console.log('Configuring authentication settings...')
    const { error: authError } = await supabase.auth.updateUser({
      password: authConfig.security.passwordMinLength.toString(),
    })
    if (authError) throw authError
    console.log('Authentication settings configured successfully')

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Database setup completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Database setup failed:', error)
    process.exit(1)
  }) 