import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test profiles table
    const { data: profilesTest, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1)

    // Try to get information about the profiles table structure
    const { data: rpcResult, error: rpcError } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT 
            column_name, 
            data_type, 
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = 'profiles' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      })
      .single()

    // Check for foreign key constraints on profiles table
    const { data: constraintsResult, error: constraintsError } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT 
            tc.constraint_name,
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.table_name = 'profiles'
            AND tc.constraint_type = 'FOREIGN KEY';
        `
      })
      .single()

    return NextResponse.json({
      status: 'success',
      profiles: {
        exists: !profilesError,
        error: profilesError?.message || null,
        data_sample: profilesTest
      },
      schema: {
        columns: rpcResult || null,
        rpc_error: rpcError?.message || null
      },
      constraints: {
        foreign_keys: constraintsResult || null,
        constraints_error: constraintsError?.message || null
      }
    })

  } catch (error) {
    console.error('Profiles schema check error:', error)
    return NextResponse.json({
      error: 'Failed to check profiles schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 