import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'E-mail e código são obrigatórios.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sanitizedCode = String(code).trim().slice(0, 6);

    const supabase = getSupabaseAdmin();

    // 1. Buscar o registro na tabela email_verifications
    const { data, error } = await supabase
      .from('email_verifications')
      .select('id, code, expires_at, used, password_hash')
      .eq('email', normalizedEmail)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      return NextResponse.json({ error: 'Nenhum código encontrado. Solicite um novo cadastro.' }, { status: 400 });
    }

    // 2. Verificar expiração
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'O código de confirmação expirou. Solicite um novo cadastro.' }, { status: 400 });
    }

    // 3. Comparação segura (timing-safe) para evitar brute-force
    const codeMatch = (() => {
      try {
        const a = Buffer.from(data.code);
        const b = Buffer.from(sanitizedCode);
        return a.length === b.length && timingSafeEqual(a, b);
      } catch {
        return false;
      }
    })();

    if (!codeMatch) {
      return NextResponse.json({ error: 'Código de confirmação incorreto. Tente novamente.' }, { status: 400 });
    }

    // 4. Criar a conta no Supabase Auth com email já confirmado (sem disparar email do Supabase)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: data.password_hash,
      email_confirm: true, // confirma automaticamente — nenhum email do Supabase é enviado
    });

    if (createError) {
      console.error('[Register Confirm] Create user error:', createError.message);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // 5. Marcar o código como usado
    await supabase.from('email_verifications').update({ used: true }).eq('id', data.id);

    return NextResponse.json({ success: true, user: userData.user });

  } catch (err: any) {
    console.error('[API Register Confirm Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar confirmação' }, { status: 500 });
  }
}
