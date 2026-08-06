import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve conter no mínimo 6 caracteres.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Verificar se o email já existe na tabela de usuários do Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const alreadyExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (alreadyExists) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
    }

    // 1. Gerar código OTP de 6 dígitos
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos

    // 2. Salvar o código na tabela email_verifications (remove anterior se existir)
    await supabase.from('email_verifications').delete().eq('email', email.toLowerCase());

    const { error: insertError } = await supabase.from('email_verifications').insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt,
      password_hash: password, // armazenado temporariamente para criar a conta após verificação
    });

    if (insertError) {
      console.error('[Register] Supabase insert error:', insertError.message);
      return NextResponse.json({ error: 'Erro ao iniciar cadastro. Tente novamente.' }, { status: 500 });
    }

    // 3. Enviar e-mail com o código OTP via Resend (100% controlado por nós)
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'REV SYSTEM <noreply@revsystemcc.com>',
        to: email,
        subject: `${code} é o seu código de confirmação REV SYSTEM ⚡`,
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030303; color: #ffffff; padding: 40px 20px; max-width: 550px; margin: 0 auto; border-radius: 24px; border: 1px solid #220505; box-shadow: 0 20px 50px rgba(230,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 8px 16px; background-color: rgba(230, 0, 0, 0.08); border: 1px solid rgba(230, 0, 0, 0.2); border-radius: 12px; margin-bottom: 15px;">
              <span style="color: #ff3333; font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">Segurança Ativa</span>
            </div>
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0; text-shadow: 0 0 10px rgba(230,0,0,0.2);">REV SYSTEM</h1>
            <div style="width: 80px; height: 3px; background: linear-gradient(90deg, #ff3333, transparent); margin: 10px auto 0; border-radius: 2px;"></div>
          </div>
          <div style="background-color: #0a0a0c; padding: 35px 25px; border-radius: 20px; border: 1px solid #141416; margin-bottom: 25px; text-align: center;">
            <h2 style="color: #ffffff; font-size: 19px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">Ativar Sua Conta</h2>
            <p style="color: #a1a1aa; font-size: 13.5px; line-height: 1.6; margin: 0 0 25px 0;">
              Obrigado por iniciar o seu cadastro na REV SYSTEM. Use o código de verificação abaixo para confirmar seu endereço de e-mail:
            </p>
            <div style="margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #120202 0%, #08080a 100%); padding: 20px 40px; border-radius: 16px; font-family: 'Courier New', Courier, monospace; font-size: 38px; color: #ff3333; display: inline-block; font-weight: 900; letter-spacing: 8px; border: 1px solid rgba(230, 0, 0, 0.35); box-shadow: 0 0 25px rgba(230, 0, 0, 0.15);">
                ${code}
              </div>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.05); margin: 25px 0;"></div>
            <p style="color: #71717a; font-size: 12px; margin: 0; line-height: 1.5;">
              ⏰ Este código é válido por <strong>10 minutos</strong>.<br>
              Se você não solicitou este e-mail, pode ignorá-lo com segurança.
            </p>
          </div>
          <div style="text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 25px; line-height: 1.6;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #a1a1aa;">REV SYSTEM - Plataforma de Produtos Digitais</p>
            <p style="margin: 0 0 15px 0;">Suporte oficial via Discord</p>
            <p style="margin: 0; font-size: 10px; color: #3f3f46;">© ${new Date().getFullYear()} REV SYSTEM. Todos os direitos reservados.</p>
          </div>
        </div>
      `,
      });
      console.log(`[Register] OTP ${code} sent to: ${email}`);
    } catch (emailError: any) {
      console.error('[Register] Failed to send email via Resend:', emailError.message);
      return NextResponse.json({ error: 'Falha ao enviar e-mail com o código de confirmação.' }, { status: 500 });
    }

    return NextResponse.json({ otpRequired: true, email });

  } catch (err: any) {
    console.error('[API Register Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar cadastro' }, { status: 500 });
  }
}
