import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-revsystem';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export async function POST(req: Request) {
  try {
    const { email, password, code, token } = await req.json();

    if (!email || !password || !code || !token) {
      return NextResponse.json({ error: 'Todos os parâmetros são necessários (e-mail, senha, código e token).' }, { status: 400 });
    }

    // 1. Desestruturar token
    const parts = token.split('.');
    if (parts.length !== 2) {
      return NextResponse.json({ error: 'Token de verificação inválido.' }, { status: 400 });
    }

    const [hash, expiresStr] = parts;
    const expires = parseInt(expiresStr);

    // 2. Verificar expiração
    if (Date.now() > expires) {
      return NextResponse.json({ error: 'O código de confirmação expirou. Solicite um novo cadastro.' }, { status: 400 });
    }

    // 3. Recalcular e validar hash HMAC
    const hashData = `${email}|${code}|${expiresStr}`;
    const calculatedHash = crypto.createHmac('sha256', SECRET_KEY).update(hashData).digest('hex');

    if (hash !== calculatedHash) {
      return NextResponse.json({ error: 'Código de confirmação incorreto.' }, { status: 400 });
    }

    // 4. Criar conta definitiva com privilégio de Admin (auto-confirmando o e-mail)
    // Isso impede que o Supabase envie o e-mail laranja padrão do StorM!
    const supabaseAdmin = createClient(supabaseUrl, SECRET_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error('[API Register Confirm Error]:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: data.user 
    });

  } catch (err: any) {
    console.error('[API Register Confirm Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar confirmação' }, { status: 500 });
  }
}
