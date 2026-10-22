import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Testing Supabase connection...')
  const { data, error } = await supabase.from('partners').select('count', { count: 'exact', head: true })
  if (error) {
    console.error('❌ Connection Failed:', error.message)
  } else {
    console.log('✅ Connection Successful!')
  }
}

run()
