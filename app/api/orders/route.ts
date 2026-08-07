import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')?.value

    if (!token) {
      return NextResponse.json({ orders: [] }, { status: 401 })
    }

    // Verificar usuário
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData.user) {
      return NextResponse.json({ orders: [] }, { status: 401 })
    }

    const userId = userData.user.id

    // Buscar pedidos do usuário na tabela orders
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      // Se a tabela não existir ainda, retorna vazio sem erro
      console.error('[Orders API]:', error.message)
      return NextResponse.json({ orders: [] })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (err: any) {
    console.error('[Orders API Error]:', err)
    return NextResponse.json({ orders: [] }, { status: 500 })
  }
}
