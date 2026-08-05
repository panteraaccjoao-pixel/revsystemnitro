import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-revsystem';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve conter no mínimo 6 caracteres.' }, { status: 400 });
    }

    // 1. Gerar OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Definir expiração (15 minutos de validade)
    const expires = Date.now() + 15 * 60 * 1000;
    
    // 3. Gerar assinatura HMAC segura
    const hashData = `${email}|${otp}|${expires}`;
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(hashData).digest('hex');
    const secureToken = `${hash}.${expires}`;

    // 4. Enviar e-mail contendo o código OTP via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: 'REV SYSTEM <onboarding@resend.dev>',
        to: email,
        subject: `${otp} é o seu código de confirmação REV SYSTEM ⚡`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030303; color: #ffffff; padding: 40px 20px; max-width: 550px; margin: 0 auto; border-radius: 24px; border: 1px solid #220505; box-shadow: 0 20px 50px rgba(230,0,0,0.08);">
            
            <!-- Header Brand -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; padding: 8px 16px; background-color: rgba(230, 0, 0, 0.08); border: 1px solid rgba(230, 0, 0, 0.2); border-radius: 12px; margin-bottom: 15px;">
                <span style="color: #ff3333; font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">Segurança Ativa</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0; text-shadow: 0 0 10px rgba(230,0,0,0.2);">REV SYSTEM</h1>
              <div style="width: 80px; height: 3px; background: linear-gradient(90deg, #ff3333, transparent); margin: 10px auto 0; border-radius: 2px;"></div>
            </div>
            
            <!-- Main Content Area -->
            <div style="background-color: #0a0a0c; padding: 35px 25px; border-radius: 20px; border: 1px solid #141416; margin-bottom: 25px; text-align: center;">
              <h2 style="color: #ffffff; font-size: 19px; font-weight: 800; margin-top: 0; margin-bottom: 12px; tracking: -0.5px;">Ativar Sua Conta</h2>
              <p style="color: #a1a1aa; font-size: 13.5px; line-height: 1.6; margin: 0 0 25px 0;">
                Obrigado por iniciar o seu cadastro na REV SYSTEM. Use o código de verificação abaixo para confirmar seu endereço de e-mail e acessar a plataforma:
              </p>
              
              <!-- OTP Box -->
              <div style="margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #120202 0%, #08080a 100%); padding: 20px 40px; border-radius: 16px; font-family: 'Courier New', Courier, monospace; font-size: 38px; color: #ff3333; display: inline-block; font-weight: 900; letter-spacing: 8px; border: 1px solid rgba(230, 0, 0, 0.35); box-shadow: 0 0 25px rgba(230, 0, 0, 0.15); margin-left: 8px;">
                  ${otp}
                </div>
              </div>
              
              <div style="height: 1px; background: rgba(255,255,255,0.05); margin: 25px 0;"></div>
              
              <p style="color: #71717a; font-size: 12px; margin: 0; line-height: 1.5;">
                ⏰ Este código é válido por <strong>15 minutos</strong>.<br>
                Se você não solicitou este e-mail, pode ignorá-lo com segurança.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 25px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #a1a1aa;">REV SYSTEM - Plataforma de Produtos Digitais</p>
              <p style="margin: 0 0 15px 0;">Suporte oficial via Discord</p>
              <p style="margin: 0; font-size: 10px; color: #3f3f46;">© 2026 REV SYSTEM. Todos os direitos reservados.</p>
            </div>
          </div>
        `
      });
      console.log(`[Resend] Verification OTP ${otp} sent to:`, email);
    } catch (emailError) {
      console.error('[Resend Error] Failed to send OTP email:', emailError);
      return NextResponse.json({ error: 'Falha ao enviar e-mail com o código de confirmação.' }, { status: 500 });
    }

    // Retorna que o OTP é necessário e envia as informações de hash para validação posterior
    return NextResponse.json({ 
      otpRequired: true, 
      token: secureToken,
      email 
    });

  } catch (err: any) {
    console.error('[API Register Error]:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao processar cadastro' }, { status: 500 });
  }
}
