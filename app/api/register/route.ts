import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve conter no mínimo 6 caracteres.' }, { status: 400 });
    }

    // Criar conta no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('[API Register Error]:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Enviar e-mail de boas-vindas / confirmação via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      // Nota: Caso o domínio 'revsystem.com' ainda não esteja com o DNS verificado no painel do Resend,
      // a API do Resend enviará utilizando 'onboarding@resend.dev' como remetente automático para testes.
      await resend.emails.send({
        from: 'REV SYSTEM <onboarding@resend.dev>',
        to: email,
        subject: 'Bem-vindo à REV SYSTEM! ⚡ Confirmar Cadastro',
        html: `
          <div style="font-family: sans-serif; background-color: #050505; color: #ffffff; padding: 30px; border-radius: 15px; border: 1px solid #1a1a1a; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #ef4444; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">REV SYSTEM</h1>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Plataforma de Produtos Digitais</p>
            </div>
            
            <div style="background-color: #0a0a0a; padding: 25px; border-radius: 12px; border: 1px solid #27272a; margin-bottom: 20px; text-align: left;">
              <h2 style="color: #ffffff; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 15px;">Seu cadastro foi realizado! 🎉</h2>
              <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                Olá, agradecemos por se cadastrar na nossa plataforma. Sua conta está criada com sucesso!
              </p>
              
              <div style="margin: 25px 0; text-align: center;">
                <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 15px;">Sua conta foi registrada com o seguinte e-mail:</p>
                <div style="background-color: #1a1a1a; padding: 12px 24px; border-radius: 8px; font-family: monospace; font-size: 14px; color: #ef4444; display: inline-block; font-weight: bold; border: 1px solid rgba(239, 68, 68, 0.3);">
                  ${email}
                </div>
              </div>
            </div>
            
            <div style="text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #1a1a1a; padding-top: 20px; line-height: 1.5;">
              <p style="margin: 0 0 5px 0;">© 2026 REV SYSTEM. Todos os direitos reservados.</p>
              <p style="margin: 0;">Este é um e-mail automático enviado via Resend, por favor não responda.</p>
            </div>
          </div>
        `
      });
      console.log('[Resend] Welcome email queued successfully to:', email);
    } catch (emailError) {
      console.error('[Resend Error] Failed to send email via Resend:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      session: data.session, 
      user: data.user 
    });

  } catch (err: any) {
    console.error('[API Register Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar cadastro' }, { status: 500 });
  }
}
