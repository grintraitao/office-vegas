/**
 * Script to create demo users via Supabase Admin API
 *
 * Usage:
 * 1. Set SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 2. Run: npx tsx scripts/create-users.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xdkiwelcfjoudhdiinft.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  console.log('\nTo get your service role key:')
  console.log('1. Go to Supabase Dashboard → Settings → API')
  console.log('2. Copy "service_role" key (keep it secret!)')
  console.log('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const users = [
  { email: 'employee1@demo.com', password: 'Demo@123', name: 'Nguyễn Văn A', nickname: 'Anh A', role: 'employee' as const },
  { email: 'employee2@demo.com', password: 'Demo@123', name: 'Trần Thị B', nickname: 'Chị B', role: 'employee' as const },
  { email: 'employee3@demo.com', password: 'Demo@123', name: 'Lê Văn C', nickname: 'Anh C', role: 'employee' as const },
  { email: 'employee4@demo.com', password: 'Demo@123', name: 'Phạm Thị D', nickname: 'Chị D', role: 'employee' as const },
]

async function createUsers() {
  console.log('🚀 Creating demo users...\n')

  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: user.name,
          nickname: user.nickname,
          role: user.role,
        }
      })

      if (error) {
        if (error.message.includes('already been registered')) {
          console.log(`⚠️  ${user.email} - Already exists`)
        } else {
          console.error(`❌ ${user.email} - ${error.message}`)
        }
      } else {
        console.log(`✅ ${user.email} - Created (${user.nickname})`)
      }
    } catch (e) {
      console.error(`❌ ${user.email} - ${e}`)
    }
  }

  console.log('\n📝 Login credentials:')
  console.log('   Password for all: Demo@123')
  console.log('\n✨ Done!')
}

createUsers()
