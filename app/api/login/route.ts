import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    // Autenticar com o Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[API Login Error]:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Retornar a sessão e dados de usuário
    return NextResponse.json({ 
      success: true, 
      session: data.session, 
      user: data.user 
    });

  } catch (err: any) {
    console.error('[API Login Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar login' }, { status: 500 });
  }
}
