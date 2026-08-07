import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cria um cliente com privilégios de admin (service role) que ignora o RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { action, payload, id } = await req.json();

    if (action === 'insert') {
      const { data, error } = await supabaseAdmin.from('products').insert([payload]).select();
      if (error) throw error;
      return NextResponse.json({ success: true, data: data?.[0] });
    }

    if (action === 'update') {
      if (!id) throw new Error("ID is required for update");
      const { data, error } = await supabaseAdmin.from('products').update(payload).eq('id', id).select();
      if (error) throw error;
      return NextResponse.json({ success: true, data: data?.[0] });
    }

    if (action === 'delete') {
      if (!id) throw new Error("ID is required for delete");
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });

  } catch (error: any) {
    console.error("Erro na API admin de produtos:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
