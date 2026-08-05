import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    // 1. Validar Captcha do Google reCAPTCHA v2 se a chave secreta estiver configurada no servidor
    if (RECAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return NextResponse.json({ error: 'Validação de segurança (Captcha) é obrigatória.' }, { status: 400 });
      }

      try {
        // A API de verificação do Google reCAPTCHA espera parâmetros no formato x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('secret', RECAPTCHA_SECRET_KEY);
        params.append('response', captchaToken);

        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });

        const verifyData = await verifyRes.json();
        
        if (!verifyData.success) {
          console.error('[Google reCAPTCHA Verify Failed]:', verifyData);
          return NextResponse.json({ error: 'Falha na verificação de segurança (Google reCAPTCHA). Tente novamente.' }, { status: 400 });
        }
      } catch (captchaErr) {
        console.error('[Google reCAPTCHA Error]:', captchaErr);
        return NextResponse.json({ error: 'Erro ao validar captcha de segurança.' }, { status: 500 });
      }
    }

    // 2. Autenticar com o Supabase Auth
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
